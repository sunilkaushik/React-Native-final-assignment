import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import type { Product } from '../types/product';

const SCREEN_WIDTH = Dimensions.get('window').width;
const NUM_COLUMNS = 2;
const HORIZONTAL_PADDING = 16;
const ITEM_MARGIN = 8;
const ITEM_WIDTH = Math.floor((SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - ITEM_MARGIN * (NUM_COLUMNS - 1)) / NUM_COLUMNS);
const IMAGE_HEIGHT = 140;
const INFO_HEIGHT = 100;
const ITEM_HEIGHT = IMAGE_HEIGHT + INFO_HEIGHT;

export { ITEM_HEIGHT };

export default function ProductCard({ product, onPress }: { product: Product; onPress?: (p: Product) => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress && onPress(product)} activeOpacity={0.8}>
      <Image source={{ uri: product.thumbnail || product.images?.[0] }} style={styles.image} />
      <View style={styles.info}>
        <Text numberOfLines={2} style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>₹{product.price}</Text>
        <Text numberOfLines={1} style={styles.category}>{product.category}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: ITEM_MARGIN,
    marginRight: ITEM_MARGIN,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
  info: {
    padding: 8,
    height: INFO_HEIGHT,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0a7',
  },
  category: {
    fontSize: 12,
    color: '#666',
  },
});
