// MainScreen.js
import React from "react";
import { Title } from "react-native-paper";
import { Icon, CheckBox } from "@rneui/themed";
import { StyleSheet, View,Dimensions, SafeAreaView, ScrollView, } from "react-native";
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

export const StockList = () => {
  const navigation = useNavigation();
  const [stocks, setStocks] = useState([]);


  const formatDate = (dt) => {
    var y = dt.getFullYear();
    var m = ('00' + (dt.getMonth()+1)).slice(-2);
    var d = ('00' + dt.getDate()).slice(-2);
    return (y + '-' + m + '-' + d);
  }
  useEffect(() => {
    const willFocusSubscription = navigation.addListener('focus', () => {
      getRemainItem();
    })
    return willFocusSubscription
  }, [])
  const getRemainItem = async()=>{
    // get all data
    var date = formatDate(new Date());
    axios
    .get("/near_date/"+date)
    .then((response) => {
      return response.data.data;
    })
    .then((user) => {
        setStocks(user);
    })
    .catch((error) => console.log(error));
  }
  // 近いやつ
  useEffect(async () => {
    getRemainItem();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <ScrollView>
      <View style={{ alignItems: "center", paddingHorizontal:40, paddingTop:10}}>
        <Button 
          style={{width:Dimensions.get('window').width*0.7, fontSize:16}}
          onPress={() => navigation.navigate("RegisterAndShopList")}
          titleStyle={{fontSize: 16 }}>
          {'過去買ったものから'+'\n'+'ストック品を追加'}
        </Button>
        </View>
        <View
            style={{
            alignItems: "center",
            flexDirection: "row",
            paddingTop: 10,
            paddingBottom: 10,
            
        }}
        >
          <Text>ストックリスト</Text>
        </View>
        <View style={{ paddingBottom: "2%" }}>
        {stocks.map((stock, i) => (
            <ListItem key={i} bottomDivider>
              <ListItem.Content>
                <ListItem.Title>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                >
                  <Text style={{fontSize: 16}}>{stock.item_name}</Text>
                  <Text style={{fontSize: 16}}>{`  買い時まであと    `}</Text>
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>{stock.days_left}</Text>
                  <Text style={{fontSize: 16}}>{'  日'}</Text>
                                    
                </View>
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
