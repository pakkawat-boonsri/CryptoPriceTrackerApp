import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import CoinDetailScreen from "../screens/CoinDetailScreen/CoinDetailScreen";
import BottomTabNavigation from "./BottomTabNavigation";
import AddNewAssetScreen from "../screens/AddNewAssetScreen/AddNewAssetScreen";
const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Root"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Root" component={BottomTabNavigation} />
      <Stack.Screen name="CoinDetail" component={CoinDetailScreen} />
      <Stack.Screen
        name="AddNewAsset"
        component={AddNewAssetScreen}
        options={{
          headerShown: true,
          title: "Add New Asset",
          headerTitleStyle: {
            color: "white",
            fontWeight: "bold",
          },
          headerTintColor: "white",
          headerStyle: {
            backgroundColor: "#121212",
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
