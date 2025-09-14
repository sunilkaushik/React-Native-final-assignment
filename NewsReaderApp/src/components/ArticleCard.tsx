
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import type { Article } from "../../types/news";

interface Props { article: Article; }

const ArticleCard: React.FC<Props> = ({ article }) => {
  return (
    <View style={styles.card}>
      {article.urlToImage ? (
        <Image source={{ uri: article.urlToImage }} style={styles.image} />
      ) : null}
      <Text style={styles.title}>{article.title}</Text>
      {article.description ? (
        <Text style={styles.desc}>{article.description}</Text>
      ) : null}
      <Text style={styles.meta}>
        {new Date(article.publishedAt).toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 8,
    elevation: 2,
  },
  image: { height: 180, borderRadius: 10, marginBottom: 10 },
  title: { fontSize: 16, fontWeight: "700" },
  desc: { fontSize: 14, color: "#444", marginTop: 4 },
  meta: { fontSize: 12, color: "#777", marginTop: 8 },
});

export default ArticleCard;
