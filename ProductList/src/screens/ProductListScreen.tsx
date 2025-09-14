import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { fetchProducts, fetchCategories } from "../api/productsApi";

const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 10;

  const loadProducts = async (reset = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const data = await fetchProducts(reset ? 0 : skip, LIMIT, search, category);
      if (reset) {
        setProducts(data.products);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
      }
      setSkip((prev) => (reset ? LIMIT : prev + LIMIT));
      setHasMore(data.products.length === LIMIT);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    loadProducts(true);
    loadCategories();
  }, [search, category]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} resizeMode="cover" />
      <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.price}>💲 {item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 🔎 Search Input */}
      <TextInput
        style={styles.searchBox}
        placeholder="Search products..."
        value={search}
        onChangeText={(text) => {
          setSkip(0);
          setSearch(text);
        }}
      />

      {/* 📂 Category Filter */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.slug || item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryBtn, category === (item.slug || item.name) && styles.activeCategory]}
            onPress={() => {
              setCategory((item.slug || item.name) === category ? "" : (item.slug || item.name));
              setSkip(0);
            }}
          >
            <Text style={[styles.categoryText, category === (item.slug || item.name) && { color: "#fff" }]}> 
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* 📦 Product List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.list}
        onEndReached={() => {
          if (hasMore && !loading) loadProducts();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
        initialNumToRender={6}
        removeClippedSubviews
        getItemLayout={(data, index) => ({
          length: 180,
          offset: 180 * index,
          index,
        })}
      />
    </View>
  );
};

export default ProductList;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  searchBox: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
    padding: 8, marginBottom: 10,
  },
  categoryBtn: {
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 20, borderWidth: 1, borderColor: "#333",
    marginRight: 8, marginBottom: 10,
  },
  activeCategory: { backgroundColor: "#333" },
  categoryText: { color: "#000" },
  list: { paddingBottom: 20 },
  card: {
    flex: 1, backgroundColor: "#f9f9f9", margin: 6,
    padding: 12, borderRadius: 8, alignItems: "center",
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: { fontSize: 14, fontWeight: "bold", marginBottom: 6 },
  price: { fontSize: 12, color: "#666" },
});
