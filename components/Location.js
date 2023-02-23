import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LocInfo from "./LocInfo";

const Location = ({ data }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={() => {
        navigation.navigate("Room", { id: data._id });
      }}
    >
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: data.photos[0].url,
          }}
        />
        <Text style={styles.price}>{data.price} €</Text>
      </View>
      <LocInfo data={data} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: "100%",
    position: "relative",
  },

  image: {
    height: 200,
    width: "100%",
    resizeMode: "cover",
  },
  price: {
    backgroundColor: "black",
    color: "white",
    height: 50,
    width: 100,
    textAlign: "center",
    lineHeight: 50,
    fontSize: "20%",
    position: "absolute",
    bottom: 10,
  },
});

export default Location;
