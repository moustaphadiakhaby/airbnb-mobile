import { useEffect, useState, useRef } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import AnimatedLottieView from "lottie-react-native";
import Location from "../components/Location";

export default function HomeScreen() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const animation = useRef(null);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await axios.get(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
        );
        setData(response.data);
      };
      fetchData();
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      {!loading ? (
        <View>
          <View style={styles.container}>
            <FlatList
              data={data}
              renderItem={({ item }) => <Location data={item} />}
            />
          </View>
        </View>
      ) : (
        <View style={styles.loading}>
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
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  animation: {
    width: 200,
    height: 200,
    backgroundColor: "white",
  },
});
