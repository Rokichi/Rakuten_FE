import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ScrollView, SafeAreaView, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { Button, ThemeProvider, ListItem, Text } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

// axios を require してインスタンスを生成する
const axiosBase = require('axios');
const axios = axiosBase.create({
  baseURL: 'http://127.0.0.1:8000', // バックエンドB のURL:port を指定する
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json' 
});

export const ShopsHistory = () => {
  useEffect(() => {
    const willFocusSubscription = navigation.addListener('focus', () => {
      getShopList();
      getShopHistoryList();
    })
    return willFocusSubscription
  }, [])
  const navigation = useNavigation();
  const [shops, setShops] = useState([])
  const getShopList = ()=>{
    // get all data
    axios
      .get("/shop_list")
      .then((response) => {
        setShops(response.data.data);
      })
      .catch((error) => console.log(error));
  }
  const getShopHistoryList = ()=>{
    axios
    .get("/Done_shop_list")
    .then((response) => {
      setShopsHistory(response.data.data);
    })
    .catch((error) => console.log(error));
  }
  // 店舗一覧/shop_list
  const [shopsHistory, setShopsHistory] = useState([]);
  useEffect(async () => {
      getShopList(); 
      getShopHistoryList();
  }, []);

  return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <ScrollView>
      <Text h4>今後行く予定の店舗</Text>
      {shops.map((shop, i) => (
        <ListItem key={i} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{shop.shop_name}</ListItem.Title>
            <Button
              title="確認"
              onPress={() =>
                navigation.navigate("EachShopPurchaseList", {
                  shopName: shop.shop_name,
                })
              }
              buttonStyle={{
                backgroundColor: "rgba(78, 116, 289, 1)",
                borderRadius: 3,
              }}
              containerStyle={{
                width: 80,
                marginHorizontal: 50,
                marginVertical: 10,
              }}
            />
          </ListItem.Content>
        </ListItem>
      ))}
      <Text h4>使用店舗履歴</Text>
      {shopsHistory.map((shop, i) => (
        <ListItem key={i} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{shop.shop_name}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
};
