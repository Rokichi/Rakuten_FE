import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import {
  Button,
  ThemeProvider,
  ListItem,
  Icon,
  Input,
  Text,
} from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

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


export const PurchaseHistory = () => {
  // データ取得
  const [items, setItems] = useState([]);
  const [isCheckedList, changeCheck] = useState([]);

  const onPressCheckBox = (i) => {
    changeCheck(isCheckedList.map((flg, index) => (index === i ? !flg : flg)));
    axios.post('/Subscription_change/' + items[i].item_name);
  };

  useEffect(() => {
    const func = async () => {
      // get all data
      axios.get('/purchased')
        .then(response => {
          return response.data;
        })
        .then(user => {
          let initialIsCheckedList = [];
          for (var i = 0; i < Object.keys(user.data).length; i++) {
            initialIsCheckedList.push(user.data[i].subscription_flg);
          }
          changeCheck(initialIsCheckedList);
          setItems(user.data);
        })
        .catch(error => console.log(error))
    };
    func();
  }, []);
  // useEffect(async () => {
  //   // get all data
  //   axios.get('/purchased')
  //     .then(response => {
  //       return response.data;
  //     })
  //     .then(user => {
  //       let initialIsCheckedList = [];
  //       for (var i = 0; i < Object.keys(user.data).length; i++) {
  //         initialIsCheckedList.push(user.data[i].subscription_flg);
  //       }
  //       changeCheck(initialIsCheckedList);
  //       setItems(user.data);
  //     })
  //     .catch(error => console.log(error))
  // }, []);


  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <ScrollView>
        {/* 買うもの */}
        <Text h4>購入履歴</Text>
        {items.map((item, i) => (
          <ListItem key={i} bottomDivider>
            <ListItem.Content style={{ flexDirection: 'row' }}>
              <View style={{ justifyContent: 'flex-start' }}>
                <ListItem.Title>
                  {item.item_name}
                </ListItem.Title>
                <ListItem.Title>
                  {item.shop_name}
                </ListItem.Title>
              </View>
              <View style={{ justifyContent: 'flex-end' }}>
                <ListItem.CheckBox
                  title='定期購入'
                  center
                  checked={isCheckedList[i]}
                  onPress={() => onPressCheckBox(i)}
                />
              </View>
            </ListItem.Content>
          </ListItem>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
