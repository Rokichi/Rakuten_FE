import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import { Button, ThemeProvider, ListItem, Icon, Input } from "@rneui/themed";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export const ShopPointConfig = () => {
  const [spotList, setSpotList] = useState([{ coordinate: { latitude: 37.78825, longitude: -122.4324 }, name: 'point0' }])
  const [currentSpotName, setCurrentSpotName] = useState('')
  const [currentSpot, setCurrentSpot] = useState({ coordinate: { latitude: 37.78825, longitude: -122.4324 } })

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
          {spotList.map((spot, index) => (
            <Marker
              key={index}
              coordinate={spot.coordinate}
              title={spot.name}
              pinColor='blue'
            />
          ))}
        </MapView>
      </View>
      <View style={styles.form}>
        <Text>({currentSpot.coordinate.latitude}, {currentSpot.coordinate.longitude})</Text>
        <Input placeholder="店舗名" onChangeText={value => { setCurrentSpotName(value) }}></Input>
        <Button
          // onPress={() => editItem(i)}
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