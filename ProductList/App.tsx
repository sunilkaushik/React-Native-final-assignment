import React from "react";
import { SafeAreaView } from "react-native";
import ProductList from "./src/screens/ProductListScreen";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ProductList />
    </SafeAreaView>
  );
}
