import * as Notifications from "expo-notifications";
import * as RootNavigation from './RootNavigation';
import navigationService from './RootNavigation';

Notifications.setNotificationHandler({
handleNotification: async () => ({
  shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default async function usePushNotifications(navigation, info){
    /*
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
      */
  
  /*    Notifications.addNotificationReceivedListener((notification) => {
    setNotification(notification);
  });
  */
  if(info.flg == 0){
    await Notifications.addNotificationResponseReceivedListener((response) => {
      navigation.navigate("EachShopPurchaseList", {shopName:info.shopName});
    });
    await Notifications.scheduleNotificationAsync({
      content: {
        title: info.shopName + "に到着しました",
        body: `${info.shopName}の買い物予定をみる`,
      },
      trigger: {},
    });
  }
  if(info.flg == 1){
    Notifications.addNotificationResponseReceivedListener((response) => {
      navigation.navigate("ShopsHistory");
    });
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "店舗のリマインド",
        body: `本日は${info.text}で買い物予定があります`,
      },
      trigger: {},
    });
  }
  if(info.flg == 2){
    Notifications.addNotificationResponseReceivedListener((response) => {
      navigation.navigate("StockList");
    });
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${info.itemName}のストックが切れそうです`,
        body: `あと${info.daysLeft}日で購入予定日です`,
      },
      trigger: {},
    });
  } 
}


/*
  export default Notification = (props) => {
  const whichCase = props.which;
  const location = props.pos;

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const navigation = useNavigation();

  /*
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
  */

