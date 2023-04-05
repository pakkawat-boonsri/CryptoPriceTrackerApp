import { View, Text, Pressable } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import PortfolioAssetItem from "../PortfolioAssetItem/PortfolioAssetItem";
import { useNavigation } from "@react-navigation/native";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  allPortfolioAssets,
  allPortfolioBoughtAssetsInStorage,
} from "../../../atoms/PortfolioAssets";
import { SwipeListView } from "react-native-swipe-list-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
const PortfolioAssetsList = () => {
  const navigation = useNavigation();
  const assets = useRecoilValue(allPortfolioAssets);
  const [storageAsset, setStorageAsset] = useRecoilState(
    allPortfolioBoughtAssetsInStorage
  );

  const getCurrentBalance = () =>
    assets.reduce(
      (total, currentAsset) =>
        total + currentAsset.currentPrice * currentAsset.quantityBought,
      0
    );
  const getCurrentVauleChange = () => {
    const currentBalance = getCurrentBalance();
    const bought = assets.reduce(
      (total, currentAsset) =>
        total + currentAsset.priceBought * currentAsset.quantityBought,
      0
    );
    return (currentBalance - bought).toFixed(2);
  };

  const currentPercentageChange = () => {
    const currentBalance = getCurrentBalance();
    const bought = assets.reduce(
      (total, currentAsset) =>
        total + currentAsset.priceBought * currentAsset.quantityBought,
      0
    );
    return (((currentBalance - bought) / bought) * 100).toFixed(2) || 0;
  };

  const onDeleteAsset = async (data) => {
    const newAsset = storageAsset.filter(
      (coin) => coin.unique_id !== data.item.unique_id
    );
    const jsonValue = JSON.stringify(newAsset);
    await AsyncStorage.setItem("@portfolio_coins", jsonValue);
    setStorageAsset(newAsset);
  };

  const renderDeleteButton = (data) => {
    return (
      <Pressable
        onPress={() => onDeleteAsset(data)}
        style={{
          flex: 1,
          backgroundColor: "#ea3943",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <FontAwesome
          name="trash-o"
          size={24}
          color="white"
          style={{ marginRight: 40 }}
        />
      </Pressable>
    );
  };

  return (
    <SwipeListView
      data={assets}
      renderItem={({ item }) => <PortfolioAssetItem assetItem={item} />}
      rightOpenValue={-100}
      disableRightSwipe={true}
      keyExtractor={({ id }, index) => `${id}${index}`}
      renderHiddenItem={(data) => renderDeleteButton(data)}
      ListHeaderComponent={
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 15,
              alignItems: "center",
            }}
          >
            <View>
              <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
                Current Balance
              </Text>
              <Text
                style={{
                  color: "white",
                  fontWeight: "700",
                  fontSize: 40,
                  letterSpacing: 1,
                }}
              >
                ${getCurrentBalance().toFixed(2)}
              </Text>
              <Text
                style={{
                  color: currentPercentageChange() > 0 ? "#16c784" : "#ea3943",
                  fontWeight: "600",
                  fontSize: 15,
                }}
              >
                ${getCurrentVauleChange()} (All Time)
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                backgroundColor:
                  currentPercentageChange() > 0 ? "#16c784" : "#ea3943",
                padding: 6,
                borderRadius: 5,
                alignItems: "center",
              }}
            >
              <AntDesign
                name={currentPercentageChange() > 0 ? "caretup" : "caretdown"}
                size={12}
                color="white"
                style={{ marginHorizontal: 5 }}
              />
              <Text
                style={{
                  color: "white",
                  fontWeight: "500",
                  fontSize: 17,
                }}
              >
                {currentPercentageChange()}%
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "700",
              marginHorizontal: 15,
              paddingVertical: 20,
            }}
          >
            Your Assets
          </Text>
        </>
      }
      ListFooterComponent={
        <Pressable
          onPress={() => navigation.navigate("AddNewAsset")}
          style={{
            backgroundColor: "#4169E1",
            padding: 10,
            alignItems: "center",
            marginVertical: 25,
            marginHorizontal: 15,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "white", fontSize: 17, fontWeight: "600" }}>
            Add New Asset
          </Text>
        </Pressable>
      }
    />
  );
};

export default PortfolioAssetsList;
