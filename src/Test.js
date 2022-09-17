import { StyleSheet, View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { Button, ThemeProvider, ListItem, Icon } from "@rneui/themed";
import { Text } from "@rneui/base";
import * as Notifications from "expo-notifications";
import { Post } from "./Post";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const Test = () => {
  useEffect(() => {
    requestPermissionsAsync();
  });

  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
 

  const list = [
    {
      id: 1,
      name: "牛乳",
      subtitle: "ダイソー",
      checked: false,
    },
    {
      id: 2,
      name: "りんご",
      subtitle: "スーパー",
      checked: false,
    },
  ];
  const shoplist = [
    {
      id: 1,
      name: "ダイソー",
    },
    {
      id: 2,
      name: "スーパー",
    },
  ];

  const stocklist = [
    {
      id: 1,
      name: "ティッシュ",
      span: 30,
    },
  ];

  const [items, setItems] = useState(list);
  const [summaryItems, setSummaryItems] = useState(list);
  const [shops, setShops] = useState(shoplist);
  const [stocks, setStocks] = useState(stocklist);
  //const [alertStocks, setAleatStocks] = useState([]);
  useEffect(() => {
    fetch(`http://myjson.dit.upm.es/api/bins/gvnc`)
      .then((res) => res.json())
      .then((data) => {
        //setPosts(data.posts);
        //setPosts(data.posts);
        setTitle(data.user);
        return data.user
      })
      .then(user=>{
        summary = []
        for(var i = 0; i < 2; i++){
          summary.push(user[i]);
        }
        setSummaryItems(summary);
      });
  }, []);
  const addItem = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        name: "みかん",
        subtitle: "いえ",
        checked: false,
      },
    ]);
  };
  const setChecked = (i) => {
    setItems(
      items.map((item) => ({
        ...item,
        checked: item.id == i ? !item.checked : item.checked,
      }))
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Post posts={posts}></Post>
      <Button onPress={addItem} title="Hey!" />
      <Text h4>買うもの</Text>
      <Button
        title="3秒後にプッシュ通知する"
        onPress={scheduleNotificationAsync}
      />
      {items.map((items) => (
        
        <ListItem key={items.id} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{items.name}</ListItem.Title>
            <ListItem.Subtitle>{items.subtitle}</ListItem.Subtitle>
            <ListItem.CheckBox
              center
              title="Click Here"
              checked={items.checked}
              onPress={() => setChecked(items.id)}
            />
          </ListItem.Content>
        </ListItem>
      ))}
      <Button
        title="全商品を確認"
        containerStyle={{
          width: 200,
          marginHorizontal: 50,
          marginVertical: 10,
        }}
      />
      <Text>{JSON.stringify(items)}</Text>
      {shops.map((shops) => (
        <ListItem key={shops.id} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{shops.name}</ListItem.Title>
            <Button
              title="確認"
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
      {stocks.map((stocks) => (
        <ListItem key={stocks.id} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{stocks.name}</ListItem.Title>
            <ListItem.Subtitle>{`買い時まであと${stocks.span}日`}</ListItem.Subtitle>
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
      ></Button>
    </View>
  );
};
const scheduleNotificationAsync = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      body: "本日は3店舗で買い物予定があります",
      title: "二子玉川駅に到着しました",
    },
    trigger: {
      seconds: 5,
    },
  });
};
const requestPermissionsAsync = async () => {
  const { granted } = await Notifications.getPermissionsAsync();
  if (granted) {
    return;
  }

  await Notifications.requestPermissionsAsync();
};
