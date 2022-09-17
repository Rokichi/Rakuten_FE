import React from "react";
import { Platform, Text, View, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { Button} from "@rneui/themed";
//import usePushNotifications from "./CallAnyNotification"
import * as Notifications from "expo-notifications";
import { useEffect, useState, useRef } from "react";
import { useIsFocused } from "@react-navigation/native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


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

export const GetLocation = (props) => {
  const {navigation} = props;

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        navigation.navigate(response.notification.request.content.data.data,
          response.notification.request.content.data.props
        );
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  const formatDate = (dt) => {
    var y = dt.getFullYear();
    var m = ('00' + (dt.getMonth()+1)).slice(-2);
    var d = ('00' + dt.getDate()).slice(-2);
    return (y + '-' + m + '-' + d);
  }
  useEffect(() => {
    setPos();
  }, [])

  const setPos = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const onPressGetPos = async()=>{
    let location = await Location.getCurrentPositionAsync({});
    console.log(location.coords);
    axios.get('/remind_place/'+location.coords.latitude+'/'+location.coords.longitude)
    .then((response) => {
      try{
        //console.log(response.data.data);
        var shops = response.data.data;
        //console.log(shops);
        var text = "";
        for(let i=0; i<Object.keys(shops).length; i++){
          if(i != Object.keys(shops).length-1){
            text += shops[i].shop_name + '\n';
          }
          else{
            text += shops[i].shop_name;
          }
        }
        console.log(text);
        var info={
          flg:1,
          text:text
        }
        console.log('aaa');
        usePushNotifications(info);
        console.log('bbb');
      }catch(e){;}
    })
    .catch((error) => console.log(error));
    axios.get('/nearby_store/'+location.coords.latitude+'/'+location.coords.longitude)
    .then((response) => {
      try{
        //console.log(response.data.data);
        var shops = response.data.data;
        //console.log(shops);
        var text = "";
        for(let i=0; i<Object.keys(shops).length; i++){
            var info={
              flg:0,
              shopName:shops[i].shop_name
            }
          usePushNotifications(info);
        }      
      }catch(e){;}
    })
    .catch((error) => console.log(error));
  };
  const onPressGetNearItem =async()=>{
    var date = formatDate(new Date());
    axios.get('/date_notification/'+date)
    .then((response) => {
      return response.data.data;
    })
    .then((items) => {
      for(let i=0; i<Object.keys(items).length; i++){
        var info={
          flg:2,
          itemName:items[i].item_name,
          daysLeft:items[i].days_left
        }
      usePushNotifications(info);
      }      
    })
    .catch((error) => console.log(error));
  }
  return (
    <View>
    <Button onPress={()=>onPressGetPos()}>位置情報を取得</Button>
    <Button onPress={()=>onPressGetNearItem()}>買い時のアイテムを通知</Button>
    </View>
    );
};
const usePushNotifications=async(info)=>{
  if(info.flg == 0){scheduleNotificationAsync1(info);}
  else if(info.flg == 1){scheduleNotificationAsync2(info); }
  else if(info.flg == 2){scheduleNotificationAsync3(info); }
}

const scheduleNotificationAsync1 = async (info) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: info.shopName + "に到着しました",
      body: `${info.shopName}の買い物予定をみる`,
      data: { data: "EachShopPurchaseList", props:{shopName: info.shopName} },
    },
    trigger: {},
  });
};
const scheduleNotificationAsync2 = async (info) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "店舗のリマインド",
      body: `本日は${info.text}で買い物予定があります`,
      data: { data: "ShopsHistory"},
    },
    trigger: {},
  });
};
const scheduleNotificationAsync3 = async (info) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${info.itemName}のストックが切れそうです`,
      body: `あと${info.daysLeft}日で購入予定日です`,
      data: { data: "StockList"},
    },
    trigger: {},
  });
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
});
/*
const usePushNotifications = async (info)=>{
  if(info.flg == 0){
    scheduleNotificationAsync1(info);
  }
  else if(info.flg == 1){
    console.log('get')
    scheduleNotificationAsync2(info);
  }
  else if(info.flg == 2){
    scheduleNotificationAsync3(info);
  }
}

const scheduleNotificationAsync1 = async (info) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "買い物予定のリマインド",
      body: `本日は${info.text}で買い物予定があります`,
      data: { data: "ShopsHistory" },
    },
    trigger: {},
  });
};

const scheduleNotificationAsync2 = async (info) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: info.shopName + "に近づいています",
      body: info.shopName + "の買い物リストを表示します",
      data: { data: "EachShopPurchaseList", props: {shopName:info.shopName}},
    },
    trigger: {},
  });
};
const scheduleNotificationAsync3 = async (itemName) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "ストックが切れそうです",
      body: `今日は${itemName}の購入予定日です`,
      data: { data: "ShopsHistory" },
    },
    trigger: {},
  });
};
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }
  return token;
}*/

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }
  return token;
}
