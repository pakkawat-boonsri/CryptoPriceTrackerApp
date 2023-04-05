import {
  View,
  Text,
  Image,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import HeaderComponent from "./components/HeaderComponent";
import { AntDesign } from "@expo/vector-icons";
import { CandlestickChart, LineChart } from "react-native-wagmi-charts";
import { TextInput } from "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";
import {
  getDetailedCoinData,
  getCoinMarketChart,
  getCandleChartData,
} from "../../services/requests";
import FilterComponent from "./components/FilterComponent";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Keyboard } from "react-native";

const filterDaysArray = [
  { filterDay: "1", filterText: "24h" },
  { filterDay: "7", filterText: "7d" },
  { filterDay: "30", filterText: "30d" },
  { filterDay: "365", filterText: "1y" },
  { filterDay: "max", filterText: "All" },
];

const CoinDetailScreen = () => {
  const [coin, setCoin] = useState(null);
  const [coinMarketData, setCoinMarketData] = useState(null);
  const [coinCandleChartData, setCoinCandleChartData] = useState(null);
  const route = useRoute();
  const {
    params: { coinId },
  } = route;

  const [loading, setLoading] = useState(false);
  const [coinValue, setCoinValue] = useState("1");
  const [usdValue, setUsdValue] = useState("");
  const [selectedRange, setSelectedRange] = useState("1");
  const [isCandleChartVisible, setIsCandleChartVisible] = useState(false);

  const fetchCoinData = async () => {
    setLoading(true);
    const fetchedCoinData = await getDetailedCoinData(coinId);
    setCoin(fetchedCoinData);
    setUsdValue(fetchedCoinData.market_data.current_price.usd.toString());
    setLoading(false);
  };

  const fetchMarketCoinData = async (selectedRangeValue) => {
    const fetchedCoinMarketData = await getCoinMarketChart(
      coinId,
      selectedRangeValue
    );
    setCoinMarketData(fetchedCoinMarketData);
  };

  const fetchCandleStickChartData = async (selectedRangeValue) => {
    const fetchedSelectedCandleChartData = await getCandleChartData(
      coinId,
      selectedRangeValue
    );
    setCoinCandleChartData(fetchedSelectedCandleChartData);
  };

  useEffect(() => {
    fetchCoinData();
    fetchMarketCoinData(1);
    fetchCandleStickChartData();
  }, []);

  const memoOnSelectedRangeChange = React.useCallback(
    (range) => onSelectedRangeChange(range),
    []
  );

  if (loading || !coin || !coinMarketData || !coinCandleChartData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }
  const {
    id,
    image: { small },
    name,
    symbol,
    market_data: {
      market_cap_rank,
      current_price,
      price_change_percentage_24h,
    },
  } = coin;

  const { prices } = coinMarketData;

  const percentageColor =
    price_change_percentage_24h < 0 ? "#ea3943" : "#16c784" || "white";
  const percentageIconName =
    price_change_percentage_24h < 0 ? "caretdown" : "caretup";
  const chartColor = current_price.usd > prices[0][1] ? "#16c784" : "#ea3943";
  const screenWidth = Dimensions.get("window").width;

  const formatCurrency = ({ value }) => {
    "worklet";
    if (value === "") {
      if (current_price.usd < 1) {
        return `$${current_price.usd}`;
      }
      return `$${current_price.usd.toFixed(2)}`;
    }
    if (current_price.usd < 1) {
      return `$${parseFloat(value)}`;
    }
    return `$${parseFloat(value).toFixed(2)}`;
  };

  const changeCoinValue = (value) => {
    setCoinValue(value);
    const floatValue = parseFloat(value.replace(",", ".")) || 0;
    setUsdValue((floatValue * current_price.usd).toString());
  };

  const changeUsdValue = (value) => {
    setUsdValue(value);
    const floatValue = parseFloat(value.replace(",", ".")) || 0;
    setCoinValue((floatValue / current_price.usd).toString());
  };

  const onSelectedRangeChange = (selectedRangeValue) => {
    setSelectedRange(selectedRangeValue);
    fetchMarketCoinData(selectedRangeValue);
    fetchCandleStickChartData(selectedRangeValue);
  };

  return (
    <View style={{ flex: 1 }}>
      <LineChart.Provider
        data={prices.map(([timestamp, value]) => ({ timestamp, value }))}
      >
        <HeaderComponent
          coinId={id}
          symbol={symbol}
          images={small}
          rank={market_cap_rank}
        />
        <View
          style={{
            padding: 15,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ color: "white", fontWeight: "bold" }}>{name}</Text>
            <LineChart.PriceText
              format={formatCurrency}
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 30,
                letterSpacing: 1,
              }}
            />
          </View>

          <View
            style={{
              backgroundColor: percentageColor,
              padding: 6,
              borderRadius: 5,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <AntDesign
              name={percentageIconName}
              size={12}
              color="white"
              style={{ marginHorizontal: 5 }}
            />
            <Text style={{ color: "white", fontSize: 17, fontWeight: "500" }}>
              {price_change_percentage_24h.toFixed(2)}%
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            backgroundColor: "#2B2B2B",
            paddingVertical: 10,
            borderRadius: 5,
            marginHorizontal: 20,
            marginVertical: 5,
            marginBottom: 20,
          }}
        >
          {filterDaysArray.map((day) => (
            <FilterComponent
              filterDay={day.filterDay}
              filterText={day.filterText}
              selectedRange={selectedRange}
              onSelectedRangeChange={onSelectedRangeChange}
              key={day.filterText}
            />
          ))}
          {isCandleChartVisible ? (
            <MaterialCommunityIcons
              name="chart-line"
              size={24}
              color="white"
              onPress={() => setIsCandleChartVisible(false)}
            />
          ) : (
            <MaterialIcons
              name="waterfall-chart"
              size={24}
              color="white"
              onPress={() => setIsCandleChartVisible(true)}
            />
          )}
        </View>
        {isCandleChartVisible ? (
          <CandlestickChart.Provider
            data={coinCandleChartData.map(
              ([timestamp, open, high, low, close]) => ({
                timestamp,
                open,
                high,
                low,
                close,
              })
            )}
          >
            <CandlestickChart height={screenWidth / 2} width={screenWidth}>
              <CandlestickChart.Candles />
              <CandlestickChart.Crosshair>
                <CandlestickChart.Tooltip />
              </CandlestickChart.Crosshair>
            </CandlestickChart>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 10,
                marginTop: 20,
              }}
            >
              <View>
                <Text style={{ color: "grey", fontWeight: "600" }}>Open</Text>
                <CandlestickChart.PriceText
                  type="open"
                  style={{ color: "white", fontWeight: "600" }}
                />
              </View>
              <View>
                <Text style={{ color: "grey", fontWeight: "600" }}>High</Text>
                <CandlestickChart.PriceText
                  type="high"
                  style={{ color: "white", fontWeight: "600" }}
                />
              </View>
              <View>
                <Text style={{ color: "grey", fontWeight: "600" }}>Low</Text>
                <CandlestickChart.PriceText
                  type="low"
                  style={{ color: "white", fontWeight: "600" }}
                />
              </View>
              <View>
                <Text style={{ color: "grey", fontWeight: "600" }}>Close</Text>
                <CandlestickChart.PriceText
                  type="close"
                  style={{ color: "white", fontWeight: "600" }}
                />
              </View>
            </View>
            <View style={{ margin: 10 }}>
              <Text style={{ color: "grey", fontWeight: "600" }}>Date</Text>
              <CandlestickChart.DatetimeText
                style={{ color: "white", fontWeight: "600" }}
              />
            </View>
          </CandlestickChart.Provider>
        ) : (
          <LineChart height={screenWidth / 2} width={screenWidth}>
            <LineChart.Path color={chartColor}></LineChart.Path>
            <LineChart.CursorCrosshair color={chartColor} />
          </LineChart>
        )}

        <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
          <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
            <Text style={{ color: "white" }}>{symbol.toUpperCase()}</Text>
            <TextInput
              style={{
                color: "white",
                borderColor: "gray",
                flex: 1,
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 10,
                marginHorizontal: 10,
              }}
              value={coinValue}
              onChangeText={changeCoinValue}
              keyboardType="numeric"
              returnKeyLabel="Done"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>
          <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
            <Text style={{ color: "white" }}>USD</Text>
            <TextInput
              style={{
                color: "white",
                borderColor: "gray",
                flex: 1,
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 10,
                marginHorizontal: 10,
              }}
              returnKeyLabel="Done"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              value={usdValue}
              onChangeText={changeUsdValue}
              keyboardType="numeric"
            />
          </View>
        </View>
      </LineChart.Provider>
    </View>
  );
};

export default CoinDetailScreen;
