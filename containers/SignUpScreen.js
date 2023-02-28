import { useNavigation } from "@react-navigation/core";
import { Text, TextInput, View, TouchableOpacity, Image } from "react-native";
import axios from "axios";
import { useState, useRef } from "react";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AnimatedLottieView from "lottie-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignInScreen({ setToken, setUserId }) {
  const navigation = useNavigation();
  const animation = useRef(null);

  const [form, setForm] = useState({
    email: "",
    username: "",
    description: "",
    password: "",
  });
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSame, setIsSame] = useState(true);
  const [filled, setFilled] = useState(true);
  const [showPassword, setShowPassword] = useState({
    pass1: true,
    pass2: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { email, username, description, password } = form;

  const handleConnect = async () => {
    if (email && password && username && description) {
      if (form.password === passwordConfirm) {
        try {
          setIsLoading(true);
          const response = await axios.post(
            "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/sign_up",
            form
          );

          if (response.data.token) {
            setToken(response.data.token);
            setUserId(response.data.id);
          }
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          return alert(error.response.data.error);
        }
      } else {
        setIsSame(false);
      }
    } else {
      setFilled(false);
    }
  };

  if (!isLoading) {
    return (
      <KeyboardAwareScrollView style={{ backgroundColor: "white" }}>
        <View style={styles.container}>
          <View style={styles.logoBox}>
            <Image source={require("../images/logo.png")} style={styles.logo} />
            <Text style={styles.title}>Sign up</Text>
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
            <TextInput
              style={styles.input}
              value={form.username}
              placeholder="username"
              onChangeText={(e) => {
                setForm({ ...form, username: e });
                setFilled(true);
              }}
            />
            <TextInput
              style={styles.textArea}
              multiline
              editable
              numberOfLines={4}
              value={form.description}
              placeholder="Describe yourself in a few words..."
              onChangeText={(e) => {
                setForm({ ...form, description: e });
                setFilled(true);
              }}
            />
            <View>
              <TextInput
                style={styles.input}
                value={form.password}
                placeholder="password"
                secureTextEntry={showPassword.pass1}
                onChangeText={(e) => {
                  setForm({ ...form, password: e });
                  setFilled(true);
                  setIsSame(true);
                }}
              ></TextInput>
              <Icon
                onPress={() => {
                  setShowPassword({
                    ...showPassword,
                    pass1: !showPassword.pass1,
                  });
                }}
                name="eye-outline"
                size={30}
                color={"#717171"}
                style={styles.eye}
              />
            </View>

            <View>
              <TextInput
                style={styles.input}
                value={passwordConfirm}
                placeholder="confirm password"
                secureTextEntry={showPassword.pass2}
                onChangeText={(e) => {
                  setPasswordConfirm(e);
                  setFilled(true);
                  setIsSame(true);
                }}
              />
              <Icon
                onPress={() => {
                  setShowPassword({
                    ...showPassword,
                    pass2: !showPassword.pass2,
                  });
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
            {!isSame && (
              <Text style={styles.warning}>Password must be the same</Text>
            )}

            <TouchableOpacity
              style={styles.connectBtn}
              activeOpacity={0.85}
              onPress={handleConnect}
            >
              <Text style={styles.connectBtnText}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              enabled={false}
              onPress={() => {
                navigation.navigate("SignIn");
              }}
            >
              <Text style={styles.noConnect}>
                Already have an account ? Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  } else {
    return (
      <View style={styles.loadBox}>
        <AnimatedLottieView
          autoPlay
          ref={animation}
          style={styles.animation}
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
    marginBottom: "3%",
    marginTop: "2%",
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
    width: "100%",
    marginBottom: "5%",
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
    marginVertical: 15,
    height: 80,
    borderColor: "#FFBEC4",
    borderWidth: 2,
  },

  connect: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },

  eye: {
    height: 40,
    width: 40,
    position: "absolute",
    right: 0,
    bottom: 10,
  },

  warning: {
    color: "red",
    marginBottom: 10,
  },
  noWarning: {
    marginBottom: 10,
    opacity: 0,
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
