import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { Ionicons, EvilIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useWatchlist } from "../../../Contexts/WatchListContext/WatchListContext";
const HeaderComponent = (props) => {
  const { images, symbol, rank, coinId } = props;
  const navigation = useNavigation();
  const { watchlistCoinIds, storeWatchlistCoinId, removeWatchlistCoinId } =
    useWatchlist();
  const checkIfCoinIsWatchlisted = () =>
    watchlistCoinIds.some((coinIdValue) => coinIdValue === coinId);

  const handleWatchlistCoin = () => {
    if (checkIfCoinIsWatchlisted()) {
      return removeWatchlistCoinId(coinId);
    }
    return storeWatchlistCoinId(coinId);
  };

  return (
    <View
      style={{
        height: 56,
        flexDirection: "row",
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Pressable onPress={() => navigation.goBack()}>
        <Ionicons
          name="chevron-back-sharp"
          size={28}
          color="white"
          style={{ marginLeft: 10 }}
        />
      </Pressable>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: images }}
          style={{ width: 25, height: 25, marginRight: 5 }}
        />
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
            marginRight: 5,
          }}
        >
          {symbol.toUpperCase()}
        </Text>
        <View
          style={{
            backgroundColor: "#585858",
            paddingHorizontal: 5,
            borderRadius: 4,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>#{rank}</Text>
        </View>
      </View>

      <FontAwesome
        name={checkIfCoinIsWatchlisted() ? "star" : "star-o"}
        size={22}
        color={checkIfCoinIsWatchlisted() ? "#ea3943" : "white"}
        onPress={() => handleWatchlistCoin()}
      />
    </View>
  );
};

export default HeaderComponent;
