import { StyleSheet, View, ScrollView } from "react-native";
import { Button, ThemeProvider, ListItem, Text } from "@rneui/themed";
import * as Notifications from "expo-notifications";
import { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const Notification = (props) => {
  const whichCase = props.which;
  const location = props.pos;

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const navigation = useNavigation();

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

  
  return (
    <View>
      <Button
        title="特定位置での店舗リマインドイベント発火"
        onPress={() =>
          scheduleNotificationAsync1("二子玉川駅", [
            "スーパー",
            "コンビニ",
            "ダイソー",
            "ファミマ",
          ])
        }
      />
      <Button
        title="接近店舗リスト表示通知イベント発火"
        onPress={async () =>
          await scheduleNotificationAsync2("成城石井 ルミネ横浜店")
        }
      />
      <Button
        title="ストック切れ通知イベント発火"
        onPress={() => scheduleNotificationAsync3("ティッシュ")}
      />
      <Button
        title="緯度経度を見る"
        onPress={() => navigation.navigate("GetLocation")}
      />
    </View>
  );
};
const scheduleNotificationAsync1 = async (alertPoint, shops) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: alertPoint + "に到着しました",
      body: `本日は${shops.length}店舗で買い物予定があります`,
      data: { data: "ShopsHistory" },
    },
    trigger: {},
  });
};
const scheduleNotificationAsync2 = async (shopName) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: shopName + "に近づいています",
      body: shopName + "の買い物リストを表示します",
      data: { data: "EachShopPurchaseList", props: {shopName:shopName}},
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
const requestPermissionsAsync = async () => {
  const { granted } = await Notifications.getPermissionsAsync();
  if (granted) {
    return;
  }
  await Notifications.requestPermissionsAsync();
};

// const subscription = Notifications.addNotificationResponseReceivedListener(
//   (e) => {
//     console.log(e.notification.request.content.body);
//   }
// );
// subscription.remove();

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  });
}

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
