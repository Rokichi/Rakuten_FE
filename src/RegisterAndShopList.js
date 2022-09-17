import { StyleSheet, Text, View, ScrollView, SafeAreaView, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { Button, ThemeProvider, ListItem, Icon, Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { PurchaseHistory } from "./PurchaseHistory";


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

export const RegisterAndShopList = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  // データ取得
  useEffect(async () => {
    // get all data
    axios.get('/item_list')
        .then(response => {
          return response.data;
        })
        .then(user =>{
          setItems(user.data);
        })
        .catch(error => console.log(error))
  }, []);

  let item_n = "";
  let itemInput;
  let shop_n = "";
  let shopInput;
  let edited_item_n = "";
  let edited_shop_n = "";

  const addItem = async() => {
    // call api resister
    console.log('/Register_item_list/'+item_n+'/'+shop_n)
    axios.post('/Register_item_list/'+item_n+'/'+shop_n).catch(error => console.log(error))
    // get new data
    axios.get('/item_list')
    .then(response => {
      return response.data;
    })
    .then(user =>{
      setItems(user.data);
    })
    .catch(error => console.log(error))
    // clear input fields
    itemInput.clear();
    shopInput.clear();
  };

  const deleteItem = (id, name) => {
    axios.post('/Delete_item_list/'+name)
    .catch(error => console.log(error))
    axios.get('/item_list')
    .then(response => {
      return response.data;
    })
    .then(user =>{
      setItems(user.data);
    })
    .catch(error => console.log(error))
  };

  const editItem = (i) => {
    // console.log(i)
    // items.map((item, id) => {
    //   console.log(item)
    // })
    console.log("編集可能", edited_item_n, edited_shop_n);
    setItems(
      items.map((item, idx) =>
        idx === i
          ? {
              id: item.id,
              item_name: edited_item_n,
              shop_name: edited_shop_n,
              register_date: item.register_date,
            }
          : item
      )
    );
    // console.log(edited_item_n == '' ? '空' : 'からじゃない')
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <ScrollView>
        {/* 登録 */}
        <Text>登録</Text>
        <Input
          ref={(input)=>itemInput=input}
          placeholder="商品名"
          onChangeText={(value) => {
            item_n = value;
          }}
        ></Input>
        <Input
          ref={(input)=>shopInput=input}
          placeholder="店名"
          onChangeText={(value) => {
            shop_n = value;
          }}
        ></Input>
        <Button
          onPress={addItem}
          title="追加"
          containerStyle={{
            width: 200,
            marginHorizontal: 50,
            marginVertical: 10,
          }}
        />

        {/* 買うもの */}
        <Text>買うもの</Text>
        {items.map((item, i) => (
          <ListItem style={{alignSelf: 'stretch'}} key={item.id} bottomDivider>
            <ListItem.Content>
            <ListItem.Swipeable
                leftContent={(reset) => (
                  <Button
                    title="edit"
                    onPress={() => displayEditForm(item.id)}
                    ></Button>
                    )}
                rightContent={(reset) => (
                  <Button
                  title="delete"
                  onPress={() => deleteItem(item.id, item.item_name)}
                  ></Button>
                  )}
              >
                  <ListItem.Title style={{width:Dimensions.get('window').width*0.9}}>
                  <View style={{
                      flexDirection: "row",
                      justifyContent: "space-around"}}>
                        <Text style={{paddingHorizontal: 40 }}>{item.item_name}</Text>
                        <Text style={{paddingHorizontal: 40 }}>{item.shop_name}</Text>
                  </View>
                  </ListItem.Title>
              </ListItem.Swipeable>
              </ListItem.Content>
              
              {/* 編集フォーム */}
              {/*
              <Input
                placeholder="商品名"
                onChangeText={(value) => {
                  edited_item_n = value;
                }}
              ></Input>
              <Input
                placeholder="店名"
                onChangeText={(value) => {
                  edited_shop_n = value;
                }}
              ></Input>
              <Button
                onPress={() => editItem(i)}
                title="変更"
                containerStyle={{
                  width: 200,
                  marginHorizontal: 50,
                  marginVertical: 10,
                }}
              />
              */}
          </ListItem>
        ))}
        <PurchaseHistory></PurchaseHistory>
      </ScrollView>
    </SafeAreaView>
  );
};
