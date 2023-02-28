import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import AnimatedLottieView from "lottie-react-native";
import * as Location from "expo-location";

const MapScreen = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [coords, setCoords] = useState();

  const navigation = useNavigation();

  const animation = useRef(null);

  useEffect(() => {
    try {
      const fetchData = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setError(true);
        } else {
          let location = await Location.getCurrentPositionAsync({});
          const obj = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          const response = await axios.get(
            `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`
          );
          setData(response.data);
          setCoords(obj);
        }
        setLoading(false);
      };
      fetchData();
    } catch (error) {}
  }, []);

  return loading ? (
    <View style={styles.loading}>
      <AnimatedLottieView
        autoPlay
        ref={animation}
        style={styles.animation}
        source={require("../assets/home.json")}
      />
    </View>
  ) : error ? (
    <Text style={styles.error}>Permission refusée</Text>
  ) : (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={{
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      }}
      showsUserLocation
    >
      {data.map((item) => {
        return (
          <Marker
            key={item.location[1]}
            coordinate={{
              latitude: item.location[1],
              longitude: item.location[0],
            }}
            onPress={() => {
              navigation.navigate("Room", { id: item._id });
            }}
          />
        );
      })}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
  },
  error: {
    flex: 1,
    backgroundColor: "white",
    textAlign: "center",
    lineHeight: "",
    fontSize: 20,
  },
  loading: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  animation: {
    width: 200,
    height: 200,
    backgroundColor: "white",
  },
});

export default MapScreen;
