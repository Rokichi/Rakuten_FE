// MainScreen.js
import React from "react";
import { Title } from "react-native-paper";
import { Icon, CheckBox } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, ThemeProvider, ListItem, Text } from "@rneui/themed";

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

export const EachShopPurchaseList = (props) => {
  const { shopName } = props.route.params;
  const navigation = useNavigation();
/*
  const items = [
    { name: "aaa" },
    { name: "bbb" },
    { name: "卵" },
    { name: "牛乳" },
  ];
*/
  const [items, setItems] = useState([]);
  const [isCheckedList, changeCheck] = useState([]);

  let initialIsCheckedList = [];
  var response = null;
  // データ取得
  useEffect(()=>{
    const func = async () => {
    // get all data
    axios.get('/item_by_store/'+shopName)
    .then(response => {
          return response.data;
        })
        .then(users =>{
          for (var i = 0; i < Object.keys(users.data).length; i++) {
            initialIsCheckedList.push(false);
          }
          changeCheck(initialIsCheckedList);
          setItems(users.data);
        })
        .catch(error => console.log(error))
    }
    func();
}, []);

  const onPressCheckBox = (i) => {
    changeCheck(isCheckedList.map((flg, index) => (index === i ? !flg : flg)));
  };

  const formatDate = (dt) => {
    var y = dt.getFullYear();
    var m = ('00' + (dt.getMonth()+1)).slice(-2);
    var d = ('00' + dt.getDate()).slice(-2);
    return (y + '-' + m + '-' + d);
  }

  const onPurchaseEndBtnPressed = async() => {
    var date = formatDate(new Date());
    for(var i = 0; i < items.length;i++){
      console.log(isCheckedList[i]);
      if(isCheckedList[i]){
        await axios.post('/purchase_item/'+items[i].item_name+'/'+ date);
      }
    }
    navigation.goBack(null);
  };

  return (
    <View>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: "#F0F4F5",
        }}
      >
        <Text style={{ flex: 3, paddingLeft: 30, fontSize: 18 }}>
          {/* <Text style={{ flex: 3, paddingLeft: 30, fontSize: 16 }}> */}
          {shopName} で買うもの
        </Text>
        <Button>
          {/* <Button style={{ flex: 1 }} titleStyle={{ fontSize: 12 }}> */}
          <Icon name="arrow-down" type="evilicon" color="#FFFFFF" />
          登録日順
        </Button>
        <Button
          type="Outline"
          style={{ flex: 1 }}
          titleStyle={{ fontSize: 12 }}
        >
          編集
        </Button>
      </View>
      <View style={{ paddingBottom: "2%" }}>
        {items.map((item, i) => (
          <ListItem key={i} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{item.item_name}</ListItem.Title>
              <ListItem.CheckBox
                center
                checked={isCheckedList[i]}
                onPress={() => onPressCheckBox(i)}
              />
            </ListItem.Content>
          </ListItem>
        ))}
      </View>
      <View style={{ alignItems: "center" }}>
        <Button
          onPress={()=>onPurchaseEndBtnPressed()}
          style={{ paddingBottom: "2%" }}
        >
          買い物を終わる
        </Button>
        <Button onPress={() => navigation.navigate("ShopsHistory")}>
          店舗一覧を見る
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
