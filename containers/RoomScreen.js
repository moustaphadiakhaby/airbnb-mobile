import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import LocInfo from "../components/LocInfo";
import AnimatedLottieView from "lottie-react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { useWindowDimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/Ionicons";

const RoomScreen = () => {
  const route = useRoute();
  const [data, setData] = useState({});
  const [show, setShow] = useState(false);

  const animation = useRef(null);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/${route.params.id}`
        );
        setData(response.data);
      };
      fetchData();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const { width } = useWindowDimensions();

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {typeof data.user === "object" ? (
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <SwiperFlatList
              showPagination
              data={data.photos}
              renderItem={({ item }) => (
                <Image
                  style={[styles.image, { width: width }]}
                  source={{ uri: item.url }}
                />
              )}
            />
            <Text style={styles.price}>{data.price} €</Text>
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            <LocInfo data={data} />
            <Text numberOfLines={!show && 3} style={styles.desc}>
              {data.description}
            </Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setShow(!show);
              }}
              style={styles.descBtn}
            >
              {!show ? (
                <Text style={styles.descBtnText}>Show more</Text>
              ) : (
                <Text style={styles.descBtnText}>Show less</Text>
              )}
              {!show ? (
                <Icon name="caret-down-outline" size={18} color={"#717171"} />
              ) : (
                <Icon name="caret-up-outline" size={18} color={"#717171"} />
              )}
            </TouchableOpacity>
          </View>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: data.location[1],
              longitude: data.location[0],
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker
              coordinate={{
                latitude: data.location[1],
                longitude: data.location[0],
              }}
            />
          </MapView>
        </View>
      ) : (
        <View style={styles.loadBox}>
          <AnimatedLottieView
            autoPlay
            ref={animation}
            style={styles.animation}
            source={require("../assets/home.json")}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    flex: 1,
    width: "100%",
    backgroundColor: "red",
  },

  avatar: {
    height: 75,
    width: 75,
    borderRadius: "50%",
    resizeMode: "contain",
  },
  loadBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  animation: {
    width: 200,
    height: 200,
    backgroundColor: "white",
  },
  imageContainer: {
    width: "100%",
    position: "relative",
  },

  image: {
    height: 250,
    flexDirection: "row",
    resizeMode: "cover",
  },
  price: {
    backgroundColor: "black",
    color: "white",
    height: 50,
    width: 90,
    textAlign: "center",
    lineHeight: 50,
    fontSize: 21,
    position: "absolute",
    bottom: 10,
  },
  desc: {
    marginTop: 15,
    marginBottom: 10,
    fontSize: 13,
    lineHeight: 18,
  },
  descBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  descBtnText: {
    fontSize: 14,
    color: "#717171",
  },
});

export default RoomScreen;
