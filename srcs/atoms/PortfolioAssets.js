import { atom, selector } from "recoil";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getWatchlistedCoinData } from "../services/requests";

export const allPortfolioBoughtAssets = selector({
  key: "allPortfolioBoughtAssets",
  get: async () => {
    const jsonValue = await AsyncStorage.getItem("@portfolio_coins");
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  },
});

export const allPortfolioBoughtAssetsfromAPI = selector({
  key: "allPortfolioBoughtAssetsFromAPI",
  get: async ({ get }) => {
    const boughtPortfolioAssets = get(allPortfolioBoughtAssetsInStorage);
    const portfolioAssetsMarketData = await getWatchlistedCoinData(
      boughtPortfolioAssets
        .map((portfolioAsset) => portfolioAsset.id)
        .join(","),
      1
    );
    const boughtAssets = boughtPortfolioAssets.map((boughtAsset) => {
      const portfolioAsset = portfolioAssetsMarketData.filter(
        (item) => boughtAsset.id === item.id
      )[0];
      return {
        ...boughtAsset,
        currentPrice: portfolioAsset.current_price,
        priceChangePercentage: portfolioAsset.price_change_percentage_24h,
      };
    });
    return boughtAssets.sort(
      (a, b) =>
        a.quantityBought * a.currentPrice < b.quantityBought * b.currentPrice
    );
  },
});

export const allPortfolioAssets = atom({
  key: "allPortfolioAssets",
  default: allPortfolioBoughtAssetsfromAPI,
});

export const allPortfolioBoughtAssetsInStorage = atom({
  key: "allPortfolioBoughtAssetsInStorage",
  default: allPortfolioBoughtAssets,
});
