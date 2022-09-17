import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import { Button, ThemeProvider, ListItem, Icon, Input } from "@rneui/themed";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from "expo-location";
import Dialog from "react-native-dialog";
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


export const NotificationPointConfig = () => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const showDialog = () => {
    setVisible(true);
  };
 //const [spotList, setSpotList] = useState([{ coordinate: { latitude: 35.46619953518658, longitude: 139.6220834558722 }, name: '指定位置' }])
//const [currentSpot, setCurrentSpot] = useState({ coordinate: { latitude: 35.46619953518658, longitude: 139.6220834558722 } })
const [spotList, setSpotList] = useState([{ coordinate: { latitude: 35.46307477210466, longitude: 139.6220678397047 }, name: '指定位置' }])
const [currentSpot, setCurrentSpot] = useState({ coordinate: { latitude: 35.46307477210466, longitude: 139.6220678397047 } })
  /*
  useEffect(async() => {
    let location = await Location.getCurrentPositionAsync({});
    var posdata = {
    coordinate: {
      latitude: location.coords.latitude,
      longitude:location.coords.longitude,
    }};
    setCurrentSpot(posdata);
  }, [])
  */
  const [currentSpotName, setCurrentSpotName] = useState('')

  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: 400,
      width: 400,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    form: {
      ...StyleSheet.absoluteFillObject,
      height: 100,
      justifyContent: 'flex-end',
      alignItems: 'center',
      position: 'absolute',
      top: 450,
    }
  });

  const editCoordinate = (e) => {
    setCurrentSpot({
      coordinate: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      }
    })
  }
  const onResistBtnPressed = async() =>{
    setVisible(true);
  }
  const handleCancel = () => {
    setVisible(false);
  };

  const handleResister = () => {
    setVisible(false);
        // get all data
        axios
        .post("/Register_remind/"+currentSpotName+'/'+ currentSpot.coordinate.latitude+'/'+ currentSpot.coordinate.longitude)
        .catch((error) => console.log(error));
        navigation.goBack(null);
  };
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: currentSpot.coordinate.latitude,
            longitude: currentSpot.coordinate.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          onPress={(e) => editCoordinate(e)}
        > 
          <Marker
            key='current_spot'
            coordinate={currentSpot.coordinate}
            title={'現在地'}
            pinColor='red'
          />
          {/*spotList.map((spot, index) => (
            <Marker
              key={index}
              coordinate={spot.coordinate}
              title={spot.name}
              pinColor='blue'
            />
          ))*/}
        </MapView>
      </View>
      <View>
      <Dialog.Container visible={visible}>
        <Dialog.Title>確認</Dialog.Title>
        <Dialog.Description>
          {`${currentSpotName}を登録しますか?`}
        </Dialog.Description>
        <Dialog.Button label="キャンセル" onPress={handleCancel} />
        <Dialog.Button label="登録" onPress={handleResister} />
      </Dialog.Container>
      </View>
      <View style={styles.form}>
        <Text>({currentSpot.coordinate.latitude}, {currentSpot.coordinate.longitude})</Text>
        <Input placeholder="通知位置の名前" onChangeText={value => { setCurrentSpotName(value) }}></Input>
        <Button
          onPress={() => onResistBtnPressed()}
          title="登録"
          containerStyle={{
            width: 200,
            marginHorizontal: 50,
            marginVertical: 10,
          }} />
      </View>

    </SafeAreaView>
  )
}