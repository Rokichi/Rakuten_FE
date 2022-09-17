import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { Button, ThemeProvider, ListItem, Text } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Notification } from "./Notification";
import usePushNotifications from "./CallAnyNotification";
import { GetLocation } from "./GetLocation";

// axios を require してインスタンスを生成する
const axiosBase = require("axios");
const axios = axiosBase.create({
  baseURL: "http://127.0.0.1:8000", // バックエンドB のURL:port を指定する
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  responseType: "json",
});

export const Home = () => {
  const formatDate = (dt) => {
    var y = dt.getFullYear();
    var m = ('00' + (dt.getMonth()+1)).slice(-2);
    var d = ('00' + dt.getDate()).slice(-2);
    return (y + '-' + m + '-' + d);
  }
  const getItemList = async() => {
    // get all data
    axios
    .get("/item_list")
    .then((response) => {
      setItems(response.data.data);
      return response.data.data;
    })
    .then((user) => {
      summary = [];
      var num = user.length;
      if (num > 2) {
        num = 2;
      }
      for (var i = 0; i < num; i++) {
        summary.push(user[user.length - i - 1]);
      }
      setSummaryItems(summary);
    })
    .catch((error) => console.log(error));
  }
  const getShopList = async() =>{
    // get all data
    axios
    .get("/shop_list")
    .then((response) => {
      setShops(response.data.data);
    })
    .catch((error) => console.log(error));
  }

  const getRemainItem = async()=>{
    // get all data
    var date = formatDate(new Date());
    axios
    .get("/near_date/"+date)
    .then((response) => {
      return response.data.data;
    })
    .then((user) => {
      summ = [];
      summary = {};
      var num = user.length;
      if (num > 1) {
        num = 1;
      }
      for (var i = 0; i < num; i++) {
        summary["item_name"] = user[i].item_name
        summary["item_span"] = user[i].days_left
      }
      summ.push(summary);
      setStocks(summ);
    })
    .catch((error) => console.log(error));
  }
  const [items, setItems] = useState([]);
  const [summaryItems, setSummaryItems] = useState([]);
  const [shops, setShops] = useState([]);
  const [stocks, setStocks] = useState([]);
  const navigation = useNavigation();
  
  useEffect(() => {
    const willFocusSubscription = navigation.addListener('focus', () => {
      getItemList();
      getShopList();
      getRemainItem();
    })
    return willFocusSubscription
  }, [])

  // データ取得
  useEffect(async () => {
    getItemList();
  }, []);
  
  // 店舗一覧/shop_list
  useEffect(async () => {
    getShopList();
  }, []);

  // 近いやつ
  useEffect(async () => {
    getRemainItem();
  }, []);

  const onTestPress = async() => {
    //usePushNotifications({flg:1, shopName:"shopName"});
    usePushNotifications(navigation);
  }

  return (
    <ScrollView>
      <ThemeProvider>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text h4>買うもの</Text>
          {summaryItems.map((item) => (
            <ListItem key={item.id} bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{item.item_name}</ListItem.Title>
                <ListItem.Subtitle>{item.shop_name}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))}
          <Button
            title="全商品を確認"
            onPress={() => navigation.navigate("RegisterAndShopList")}
            containerStyle={{
              width: 200,
              marginHorizontal: 50,
              marginVertical: 10,
            }}
          />
          <Text h4>行く予定の店舗</Text>
          <Button
            title="全店舗確認"
            onPress={() => navigation.navigate("ShopsHistory")}
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
          {shops.map((shop) => (
            <ListItem key={shop.id} bottomDivider>
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
          <Text h4>買い時のアイテム</Text>
          {stocks.map((stocks, i) => (
            <ListItem key={i} bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{stocks.item_name}</ListItem.Title>
                <ListItem.Subtitle>{`買い時まであと${stocks.item_span}日`}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))}
          <Button
            title="詳細を確認"
            containerStyle={{
              width: 200,
              marginHorizontal: 50,
              marginVertical: 10,
            }}
            onPress={() => navigation.navigate("StockList")}
          ></Button>
          <Button
            title="リマインド位置設定"
            containerStyle={{
              width: 200,
              marginHorizontal: 50,
              marginVertical: 50,
            }}
            onPress={() => navigation.navigate("NotificationPointConfig")}
          ></Button>
        </View>
        <GetLocation navigation={navigation}/>
        {/*<Notification></Notification>*/}
      </ThemeProvider>
    </ScrollView>
  );
};
