import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View, FlatList, ActivityIndicator, RefreshControl, Text, TouchableOpacity
} from "react-native";
import type { Article } from "../../types/news";
import { fetchTopHeadlines } from "../services/newsApi";
import { mergeByUrl } from "../utils/merge";
import {
  readNewsCache, saveNewsCache, isStale, DEFAULT_TTL_MS
} from "../utils/storage";

import ArticleCard from "../components/ArticleCard";

const PAGE_SIZE = 20;
const COUNTRY   = "us";

const NewsListScreen: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // avoid duplicate onEndReached calls
  const onEndReachedCalledDuringMomentum = useRef(false);

  const hasMore = useMemo(() => {
    if (totalResults == null) return true;
    return articles.length < totalResults;
  }, [articles.length, totalResults]);

  const bootstrap = useCallback(async () => {
    // 1) Try cache first (instant UI)
    const cached = await readNewsCache();
    if (cached.articles.length) {
      setArticles(cached.articles);
      setTotalResults(cached.meta?.totalResults ?? null);
      setPage(Math.max(1, Math.ceil(cached.articles.length / (cached.meta?.pageSize ?? PAGE_SIZE))));
    }
    // 2) If cache stale OR empty, force refresh
    if (!cached.articles.length || isStale(cached.meta, DEFAULT_TTL_MS)) {
      await refresh();
    }
  }, []);

  const loadPage = useCallback(async (nextPage: number) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTopHeadlines(nextPage, PAGE_SIZE, COUNTRY);
      if (res.status !== "ok") throw new Error("API error");
      setTotalResults(res.totalResults);
      setArticles(prev => {
        const merged = nextPage === 1 ? res.articles : mergeByUrl(prev, res.articles);
        // save/overwrite cache only on page=1 or when we actually add new items
        if (nextPage === 1 || merged.length !== prev.length) {
          void saveNewsCache(merged, {
            savedAt: Date.now(),
            totalResults: res.totalResults,
            pageSize: PAGE_SIZE,
            country: COUNTRY,
          });
        }
        return merged;
      });
      setPage(nextPage);
    } catch (e: any) {
      setError(e?.message || "Failed to load news");
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await loadPage(1);
    setRefreshing(false);
  }, [loadPage]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    await loadPage(page + 1);
  }, [loading, hasMore, page, loadPage]);

  useEffect(() => { void bootstrap(); }, [bootstrap]);

  return (
    <View style={{ flex: 1, backgroundColor: "#f6f6f6" }}>
      {error ? (
        <View style={{ padding: 16 }}>
          <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
          <TouchableOpacity onPress={refresh} style={{ marginTop: 10, alignSelf: "center" }}>
            <Text style={{ color: "#007AFF", fontWeight: "600" }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        data={articles}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => <ArticleCard article={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum.current = false; }}
        onEndReached={() => {
          if (!onEndReachedCalledDuringMomentum.current) {
            onEndReachedCalledDuringMomentum.current = true;
            void loadMore();
          }
        }}
        ListFooterComponent={
          loading && articles.length > 0 ? (
            <ActivityIndicator style={{ marginVertical: 16 }} />
          ) : null
        }
        contentContainerStyle={{ paddingVertical: 8, paddingBottom: 20 }}
        removeClippedSubviews
        windowSize={11}
        maxToRenderPerBatch={10}
        initialNumToRender={8}
      />
    </View>
  );
};

export default NewsListScreen;
