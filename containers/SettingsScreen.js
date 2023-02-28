import {
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
  Image,
  Text,
} from "react-native";
import AnimatedLottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

export default function SettingsScreen({ setToken, setId }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState();
  const [picture, setPicture] = useState();
  const [initToken, setInitToken] = useState();

  const animation = useRef(null);

  const getPermissionAndGetPicture = async () => {
    //Demander le droit d'accéder à la galerie
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      //ouvrir la galerie photo
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (result.canceled === true) {
        alert("Pas de photo sélectionnée");
      } else {
        setPicture(result.assets[0].uri);
      }
    } else {
      alert("Permission refusée");
    }
  };

  const getPermissionAndTakePicture = async () => {
    //Demander le droit d'accéder à l'appareil photo
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      //ouvrir l'appareil photo
      const result = await ImagePicker.launchCameraAsync();
      console.log(result);
      setPicture(result.assets[0].uri);
    } else {
      alert("Permission refusée");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("userToken");
        setInitToken(token);

        if (id) {
          const response = await axios.get(
            `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/${id}`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );
          setData(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

  console.log(initToken);

  const sendPicture = async () => {
    setLoading(true);
    const tab = picture.split(".");
    try {
      const formData = new FormData();
      formData.append("photo", {
        uri: picture,
        name: `my-pic.${tab[1]}`,
        type: `image/${tab[1]}`,
      });
      const response = await axios.put(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/upload_picture",
        formData,
        {
          headers: {
            authorization: `Bearer ${initToken}`,
          },
        }
      );
      console.log(response.data);
      if (response.data) {
        setLoading(false);
        alert("Photo Envoyée !");
        console.log(response.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return loading ? (
    <View style={styles.loadBox}>
      <AnimatedLottieView
        autoPlay
        ref={animation}
        style={{
          width: 200,
          height: 200,
          backgroundColor: "white",
        }}
        source={require("../assets/home.json")}
      />
    </View>
  ) : (
    <KeyboardAwareScrollView style={{ backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.avatarBox}>
          <Image
            source={
              picture
                ? { uri: picture }
                : data.photo
                ? { uri: data.photo.url }
                : require("../images/blank_pfp.png")
            }
            style={styles.avatar}
          />
          <View style={styles.iconBox}>
            <Icon
              onPress={getPermissionAndGetPicture}
              size={30}
              color={"#717171"}
              name="images-sharp"
            />
            <Icon
              onPress={getPermissionAndTakePicture}
              size={30}
              color={"#717171"}
              name="camera-sharp"
            />
          </View>
        </View>
        <View style={styles.inputBox}>
          <TextInput style={styles.input} defaultValue={data.email} />
          <TextInput style={styles.input} defaultValue={data.username} />
          <TextInput
            style={styles.textArea}
            multiline
            defaultValue={data.description}
          />
        </View>

        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.85}
          onPress={picture && sendPicture}
        >
          <Text style={styles.btnText}>Update Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.85}
          onPress={() => {
            setToken(null);
            setId(null);
          }}
        >
          <Text style={styles.btnText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnOut}
          activeOpacity={0.85}
          onPress={async () => {
            setToken(null);
            await AsyncStorage.removeItem("userId");
          }}
        >
          <Text style={styles.btnText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
  },

  avatarBox: {
    paddingVertical: 20,
    marginBottom: 10,
    flexDirection: "row",
  },

  avatar: {
    height: 150,
    width: 150,
    resizeMode: "cover",
    borderRadius: "100%",
    borderColor: "#FFBEC4",
    borderWidth: 2,
    marginRight: 20,
  },

  iconBox: {
    justifyContent: "space-around",
  },
  loadBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  inputBox: {
    paddingHorizontal: "10%",
    width: "100%",
    marginBottom: "4%",
  },

  input: {
    fontSize: "18em",
    paddingBottom: 10,
    marginVertical: 15,
    borderBottomColor: "#FFBEC4",
    borderBottomWidth: 2,
    position: "relative",
  },
  textArea: {
    fontSize: "18em",
    paddingBottom: 10,
    paddingHorizontal: 10,
    marginVertical: 25,
    height: 100,
    borderColor: "#FFBEC4",
    borderWidth: 2,
  },

  btn: {
    borderColor: "#F9585E",
    width: "50%",
    padding: 15,
    borderWidth: 3,
    borderRadius: "50%",
    marginBottom: 20,
  },
  btnOut: {
    borderColor: "#F9585E",
    backgroundColor: "#E7E7E7",
    width: "50%",
    padding: 15,
    borderWidth: 3,
    borderRadius: "50%",
    marginBottom: 20,
  },

  btnText: {
    textAlign: "center",
    fontSize: "18em",
    fontWeight: "600",
    color: "#717171",
  },
});
