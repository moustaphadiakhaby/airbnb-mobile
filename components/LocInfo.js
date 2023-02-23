import { Text, View, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const LocInfo = ({ data }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.info}>
      <View style={styles.infoText}>
        <Text numberOfLines={1} style={styles.infoTitle}>
          {data.title}
        </Text>
        <View style={styles.starBox}>
          <Text style={styles.infoStars}>
            {stars.map((star, i) => {
              if (data.ratingValue >= star) {
                return (
                  <Icon key={i} size={20} color={"#F1BD03"} name="star"></Icon>
                );
              } else {
                return (
                  <Icon key={i} size={20} color={"#BBBBBB"} name="star"></Icon>
                );
              }
            })}
          </Text>
          <Text style={styles.reviews}>{data.reviews} reviews</Text>
        </View>
      </View>
      <Image
        style={styles.avatar}
        source={{
          uri: data.user.account.photo.url,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  info: {
    borderBottomColor: "#BBBBBB",
    borderBottomWidth: 1,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  infoText: {
    marginVertical: "5%",
    flex: 1,
  },
  infoTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  avatar: {
    height: 75,
    width: 75,
    borderRadius: "50%",
    resizeMode: "contain",
  },
  starBox: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  reviews: {
    color: "#BBBBBB",
    marginLeft: 5,
  },
});

export default LocInfo;
