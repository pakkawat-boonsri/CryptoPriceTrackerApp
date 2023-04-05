import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import CoinDetailScreen from "./srcs/screens/CoinDetailScreen/CoinDetailScreen";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./srcs/navigation/navigation";
import WatchListProvider from "./srcs/Contexts/WatchListContext/WatchListContext.js";
import { RecoilRoot } from "recoil";

export default function App() {
  return (
    <NavigationContainer
      theme={{
        colors: "#121212",
      }}
    >
      <RecoilRoot>
        <WatchListProvider>
          <View style={{ flex: 1, backgroundColor: "#121212", paddingTop: 40 }}>
            <Navigation />
            <StatusBar style="light" />
          </View>
        </WatchListProvider>
      </RecoilRoot>
    </NavigationContainer>
  );
}
