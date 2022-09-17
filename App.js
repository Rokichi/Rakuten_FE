// App.js
import "react-native-gesture-handler";
import React from "react";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
// Google Mapの新レンダラーに対応するために追加
import { enableLatestRenderer } from "react-native-maps";
import { MainScreen } from "./src/EachShopPurchaseList";
import { RegisterAndShopList } from "./src/RegisterAndShopList";
import { MapDemo } from "./src/MapDemo";
import { Home } from "./src/Home";
import { GetLocation } from "./src/GetLocation";
import { ShopsHistory } from "./src/ShopsHistory";
import { EachShopPurchaseList } from "./src/EachShopPurchaseList";
import { StockList } from "./src/StockList";
import navigationService from "./src/RootNavigation";
import {NotificationPointConfig} from "./src/NotificationPointConfig";

// Google Mapの新レンダラーに対応するために追加
enableLatestRenderer();

const Stack = createStackNavigator();

export default function App() {
  /*
  useEffect(()=>{
    navigationService.navigation = navigation;
  }, [navigation]);
  */
  return (
    <PaperProvider>
      {/*<GetLocation></GetLocation>*/}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="ホームページ" component={Home} />
          <Stack.Screen name="GetLocation" component={GetLocation} />
          <Stack.Screen name="Locate" component={MapDemo} />
          <Stack.Screen name="ShopsHistory" component={ShopsHistory} />
          <Stack.Screen name="RegisterAndShopList" component={RegisterAndShopList} />
          <Stack.Screen name="StockList" component={StockList} />
          <Stack.Screen
            name="EachShopPurchaseList"
            component={EachShopPurchaseList}
          />
          <Stack.Screen name="NotificationPointConfig" component={NotificationPointConfig} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
