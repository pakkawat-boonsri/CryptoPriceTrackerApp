import { View, Text } from "react-native";
import React, { Suspense } from "react";
import PortfolioAssetsList from "./PortfolioAssetsList/PortfolioAssetsList";
import { ActivityIndicator } from "react-native";

const PortfolioScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <Suspense
        fallback={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size={"large"} />
          </View>
        }
      >
        <PortfolioAssetsList />
      </Suspense>
    </View>
  );
};

export default PortfolioScreen;
