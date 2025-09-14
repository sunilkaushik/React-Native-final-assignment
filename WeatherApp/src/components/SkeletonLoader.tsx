import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function SkeletonLoader() {
  return (
    <View style={styles.container}>
      <View style={styles.skeleton} />
      <View style={styles.skeleton} />
      <View style={styles.skeleton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  skeleton: {
    width: 200,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 8,
  },
});
