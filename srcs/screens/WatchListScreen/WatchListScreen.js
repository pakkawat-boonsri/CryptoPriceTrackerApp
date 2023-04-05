import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useWatchlist } from "../../Contexts/WatchListContext/WatchListContext";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import CoinItem from "../../components/CoinItem";
import { getWatchlistedCoinData } from "../../services/requests";

const WatchListScreen = () => {
  const { watchlistCoinIds } = useWatchlist();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  const tranformCoinIds = () => watchlistCoinIds.join("%2C");

  const fetchWatchlistedCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const watchlistedCoinsData = await getWatchlistedCoinData(
      tranformCoinIds()
    );
    setCoins(watchlistedCoinsData);
    setLoading(false);
  };

  useEffect(() => {
    if (watchlistCoinIds.length > 0) {
      fetchWatchlistedCoins();
    }
  }, [watchlistCoinIds]);

  return (
    <FlatList
      data={coins}
      renderItem={({ item }) => <CoinItem marketCoin={item} />}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          tintColor="white"
          onRefresh={watchlistCoinIds.length > 0 ? fetchWatchlistedCoins : null}
        />
      }
    />
  );
};

export default WatchListScreen;
