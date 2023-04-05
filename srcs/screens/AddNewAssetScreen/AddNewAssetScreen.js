import {
  View,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import SearchableDropDown from "react-native-searchable-dropdown";
import { useRecoilState } from "recoil";
import { allPortfolioBoughtAssetsInStorage } from "../../atoms/PortfolioAssets";
import { getAllCoins, getDetailedCoinData } from "../../services/requests";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import uuid from "react-native-uuid";
const AddNewAssetScreen = () => {
  const [allCoins, setAllCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCoinId, setSelectedCoinId] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);

  const [boughtAssetQuantity, setBoughtAssetQuantity] = useState("");
  const [assetsInStorage, setAssetsInStorage] = useRecoilState(
    allPortfolioBoughtAssetsInStorage
  );
  const navigation = useNavigation();

  const fetchAllCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const data = await getAllCoins();
    setAllCoins(data);
    setLoading(false);
  };
  const fetchCoinInfo = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const data = await getDetailedCoinData(selectedCoinId);
    setSelectedCoin(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllCoins();
  }, []);

  useEffect(() => {
    if (selectedCoinId) {
      fetchCoinInfo();
    }
  }, [selectedCoinId]);

  const onAddNewAsset = async () => {
    const newAsset = {
      id: selectedCoin.id,
      unique_id: selectedCoin.id + uuid.v4(),
      name: selectedCoin.name,
      image: selectedCoin.image.small,
      ticker: selectedCoin.symbol.toUpperCase(),
      quantityBought: parseFloat(boughtAssetQuantity),
      priceBought: selectedCoin.market_data.current_price.usd,
    };
    const newAssets = [...assetsInStorage, newAsset];
    const jsonValue = JSON.stringify(newAssets);
    await AsyncStorage.setItem("@portfolio_coins", jsonValue);
    setAssetsInStorage(newAssets);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={80}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SearchableDropDown
        items={allCoins}
        onItemSelect={(item) => setSelectedCoinId(item.id)}
        containerStyle={{
          width: "100%",
          paddingHorizontal: 10,
          paddingVertical: 20,
        }}
        itemStyle={{
          padding: 10,
          marginTop: 2,
          backgroundColor: "#1e1e1e",
          borderWidth: 1,
          borderColor: "#444444",
          borderRadius: 5,
        }}
        itemTextStyle={{
          color: "white",
        }}
        resetValue={false}
        placeholder={selectedCoinId || "Select a coin..."}
        placeholderTextColor="white"
        textInputProps={{
          underlineColorAndroid: "transparent",
          style: {
            padding: 12,
            borderWidth: 1.5,
            borderColor: "#444444",
            backgroundColor: "#1e1e1e",
            borderRadius: 6,
            color: "white",
          },
        }}
      />
      {selectedCoin && (
        <>
          <View style={{ alignItems: "center", marginTop: 50, flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                vale={boughtAssetQuantity}
                placeholder="0"
                keyboardType="numeric"
                style={{ color: "white", fontSize: 90 }}
                onChangeText={setBoughtAssetQuantity}
              />
              <Text
                style={{
                  color: "grey",
                  fontWeight: "700",
                  fontSize: 20,
                  marginLeft: 5,
                  marginTop: 25,
                }}
              >
                {selectedCoin.symbol.toUpperCase()}
              </Text>
            </View>
            <Text
              style={{
                color: "grey",
                fontWeight: "600",
                fontSize: 17,
                letterSpacing: 1,
              }}
            >
              ${selectedCoin.market_data.current_price.usd} per coin
            </Text>
          </View>

          <Pressable
            disabled={boughtAssetQuantity === ""}
            onPress={onAddNewAsset}
            style={{
              backgroundColor:
                boughtAssetQuantity === "" ? "#303030" : "#4169E1",
              padding: 10,
              alignItems: "center",
              marginVertical: 50,
              marginHorizontal: 15,
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                color: boughtAssetQuantity === "" ? "grey" : "white",
                fontSize: 17,
                fontWeight: "600",
              }}
            >
              Add New Asset
            </Text>
          </Pressable>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default AddNewAssetScreen;
