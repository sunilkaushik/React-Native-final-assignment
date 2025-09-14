import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import NewsListScreen from "./src/screens/NewsListScreen";

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <NewsListScreen />
    </SafeAreaView>
  );
};

export default App;
