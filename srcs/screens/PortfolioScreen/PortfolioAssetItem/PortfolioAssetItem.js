import { View, Text, Image } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

const PortfolioAssetItem = ({ assetItem }) => {
  console.log(assetItem);
  const {
    currentPrice,
    image,
    name,
    priceChangePercentage,
    quantityBought,
    ticker,
  } = assetItem;

  const isChangePositive = () => priceChangePercentage >= 0;

  return (
    <View
      style={{
        flexDirection: "row",
        padding: 15,
        alignItems: "center",
        backgroundColor: "#121212",
      }}
    >
      <Image
        source={{ uri: image }}
        style={{ height: 40, width: 40, marginRight: 10 }}
      />
      <View>
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          {name}
        </Text>
        <Text style={{ color: "grey", fontWeight: "600" }}>{ticker}</Text>
      </View>
      <View style={{ marginLeft: "auto", alignItems: "flex-end" }}>
        <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
          {currentPrice || 0}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AntDesign
            name={isChangePositive() ? "caretup" : "caretdown"}
            size={12}
            color={isChangePositive() ? "#16c784" : "#ea3943"}
            style={{ marginHorizontal: 5 }}
          />
          <Text
            style={{
              color: isChangePositive() ? "#16c784" : "#ea3943",
              fontWeight: "600",
            }}
          >
            {priceChangePercentage.toFixed(2) || 0}%
          </Text>
        </View>
      </View>
      <View style={{ marginLeft: "auto", alignItems: "flex-end" }}>
        <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
          {(currentPrice * quantityBought).toFixed(2) || 0}
        </Text>
        <Text style={{ color: "grey", fontWeight: "600" }}>
          {quantityBought} {ticker}
        </Text>
      </View>
    </View>
  );
};

export default PortfolioAssetItem;
