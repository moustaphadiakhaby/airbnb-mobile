import { useNavigation } from "@react-navigation/core";
import { Text, TextInput, View, TouchableOpacity, Image } from "react-native";
import axios from "axios";
import { useState, useRef } from "react";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AnimatedLottieView from "lottie-react-native";

export default function SignInScreen({ setToken, setId }) {
  const navigation = useNavigation();
  const animation = useRef(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [filled, setFilled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const { email, password } = form;

  const handleConnect = async () => {
    if (email && password) {
      try {
        setIsLoading(true);
        const response = await axios.post(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/log_in",
          form
        );

        if (response.data.token) {
          setToken(response.data.token);
          setId(response.data.id);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error.message);
        return alert("Mdp ou email incorrect");
      }
    } else {
      setFilled(false);
    }
  };

  if (!isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.logoBox}>
          <Image source={require("../images/logo.png")} style={styles.logo} />
          <Text style={styles.title}>Sign in</Text>
        </View>

        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            value={form.email}
            placeholder="email"
            onChangeText={(e) => {
              setForm({ ...form, email: e });
              setFilled(true);
            }}
          />
          <View>
            <TextInput
              style={styles.input}
              value={form.password}
              placeholder="password"
              secureTextEntry={hidePassword}
              onChangeText={(e) => {
                setForm({ ...form, password: e });
                setFilled(true);
              }}
            />
            <Icon
              onPress={() => {
                setHidePassword(!hidePassword);
              }}
              name="eye-outline"
              size={30}
              color={"#717171"}
              style={styles.eye}
            />
          </View>
        </View>

        <View style={styles.connect}>
          <Text style={!filled ? styles.warning : styles.noWarning}>
            Please fill all fields
          </Text>
          <TouchableOpacity
            style={styles.connectBtn}
            activeOpacity={0.85}
            onPress={handleConnect}
            disabled={isLoading && true}
          >
            <Text style={styles.connectBtnText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          >
            <Text style={styles.noConnect}>No account ? Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return (
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
  },
  loadBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  logoBox: {
    marginBottom: "30%",
    marginTop: "10%",
  },
  logo: {
    height: 100,
    resizeMode: "contain",
  },
  title: {
    color: "#717171",
    fontWeight: "600",
    fontSize: "25em",
    textAlign: "center",
    marginTop: 25,
  },
  inputBox: {
    paddingHorizontal: "10%",
    marginBottom: "28%%",
    width: "100%",
  },

  input: {
    fontSize: "18em",
    paddingBottom: 10,
    marginVertical: 15,
    borderBottomColor: "#FFBEC4",
    borderBottomWidth: 2,
    position: "relative",
  },

  connect: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },

  warning: {
    color: "red",
    marginBottom: 10,
  },
  noWarning: {
    marginBottom: 10,
    opacity: 0,
  },

  eye: {
    height: 40,
    width: 40,
    position: "absolute",
    right: 0,
    bottom: 10,
  },

  connectBtn: {
    borderColor: "#F9585E",
    width: "50%",
    padding: 15,
    borderWidth: 3,
    borderRadius: "50%",
    marginBottom: 20,
  },

  connectBtnText: {
    textAlign: "center",
    fontSize: "18em",
    fontWeight: "600",
    color: "#717171",
  },

  noConnect: {
    color: "#717171",
  },
});
