import MapView, { Marker } from "react-native-maps";
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

  const navigation = useNavigation();

  const animation = useRef(null);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await axios.get(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around"
        );
        setData(response.data);
        setLoading(false);
      };
      const askPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setError(true);
        } else {
          fetchData();
        }
      };
      askPermission();
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
      style={styles.map}
      initialRegion={{
        latitude: 48.866667,
        longitude: 2.333333,
        latitudeDelta: 0.17,
        longitudeDelta: 0.17,
      }}
      showsUserLocation={true}
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
