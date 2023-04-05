import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const CoinItem = ({ marketCoin }) => {
  const {
    id,
    name,
    symbol,
    image,
    current_price,
    market_cap,
    market_cap_rank,
    price_change_percentage_24h,
  } = marketCoin;

  const percenttageColor =
    price_change_percentage_24h < 0 ? "#ea3934" : "#16c784";

  const percenttageIconName =
    price_change_percentage_24h < 0 ? "caretdown" : "caretup";

  const normalizeMarketCap = (marketCap) => {
    if (marketCap > 1e12) {
      return `${(marketCap / 1e12).toFixed(3)} T`;
    }
    if (marketCap > 1e9) {
      return `${(marketCap / 1e9).toFixed(3)} B`;
    }
    if (marketCap > 1e6) {
      return `${(marketCap / 1e6).toFixed(3)} M`;
    }
    if (marketCap > 1e3) {
      return `${(marketCap / 1e3).toFixed(3)} K`;
    }
    return marketCap;
  };

  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.navigate("CoinDetail", { coinId: id })}
      style={{
        flexDirection: "row",
        padding: 15,
        borderBottomColor: "#282828",
        borderBottomWidth: StyleSheet.hairlineWidth,
      }}
    >
      <Image
        source={{
          uri: image,
        }}
        style={{ height: 40, width: 40 }}
      />
      <View style={{ flexDirection: "column", paddingLeft: 10 }}>
        <Text style={{ color: "white", fontWeight: "bold", marginBottom: 5 }}>
          {name}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              backgroundColor: "grey",
              paddingHorizontal: 5,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {market_cap_rank}
            </Text>
          </View>
          <Text
            style={{
              color: "white",
              marginHorizontal: 5,
              textTransform: "uppercase",
            }}
          >
            {symbol}
          </Text>
          <AntDesign
            name={percenttageIconName}
            size={10}
            color={percenttageColor}
            style={{ marginHorizontal: 5 }}
          />
          <Text style={{ color: percenttageColor }}>
            {price_change_percentage_24h.toFixed(2)}%
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "column",
          marginLeft: "auto",
          alignItems: "flex-end",
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            marginBottom: 5,
            fontSize: 16,
          }}
        >
          {current_price}
        </Text>

        <Text style={{ color: "white" }}>
          MCap {normalizeMarketCap(market_cap)}
        </Text>
      </View>
    </Pressable>
  );
};

export default CoinItem;
