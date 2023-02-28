import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./containers/HomeScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import SettingsScreen from "./containers/SettingsScreen";
import RoomScreen from "./containers/RoomScreen";
import MapScreen from "./containers/MapScreen";
import { Image } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const setToken = async (token) => {
    if (token) {
      await AsyncStorage.setItem("userToken", token);
    } else {
      await AsyncStorage.removeItem("userToken");
    }

    setUserToken(token);
  };

  const setId = async (id) => {
    if (id) {
      await AsyncStorage.setItem("userId", id);
    } else {
      await AsyncStorage.removeItem("userId");
    }

    setUserId(id);
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      // We should also handle error for production apps
      const userToken = await AsyncStorage.getItem("userToken");

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setUserToken(userToken);

      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading === true) {
    // We haven't finished checking for the token yet
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken === null ? (
          // No token found, user isn't signed in
          <>
            <Stack.Screen
              options={{
                headerTitle: () => (
                  <Image
                    style={{
                      height: 30,
                      width: 30,
                      resizeMode: "contain",
                    }}
                    source={require("./images/logo.png")}
                  />
                ),
              }}
              name="SignIn"
            >
              {() => <SignInScreen setToken={setToken} setId={setId} />}
            </Stack.Screen>
            <Stack.Screen
              options={{
                headerTitle: () => (
                  <Image
                    style={{
                      height: 30,
                      width: 30,
                      resizeMode: "contain",
                    }}
                    source={require("./images/logo.png")}
                  />
                ),
              }}
              name="SignUp"
            >
              {() => <SignUpScreen setToken={setToken} setUserId={setUserId} />}
            </Stack.Screen>
          </>
        ) : (
          // User is signed in ! 🎉
          <Stack.Screen name="Tab" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarActiveTintColor: "tomato",
                  tabBarInactiveTintColor: "gray",
                }}
              >
                <Tab.Screen
                  name="TabHome"
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"ios-home"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Home"
                        options={{
                          headerTitle: () => (
                            <Image
                              style={{
                                height: 30,
                                width: 30,
                                resizeMode: "contain",
                              }}
                              source={require("./images/logo.png")}
                            />
                          ),
                        }}
                      >
                        {() => <HomeScreen />}
                      </Stack.Screen>

                      <Stack.Screen
                        name="Room"
                        options={{
                          headerTitle: () => (
                            <Image
                              style={{
                                height: 30,
                                width: 30,
                                resizeMode: "contain",
                              }}
                              source={require("./images/logo.png")}
                            />
                          ),
                        }}
                      >
                        {() => <RoomScreen />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="TabAroundMe"
                  options={{
                    tabBarLabel: "Around me",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons
                        name={"location-outline"}
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Map"
                        options={{
                          headerTitle: () => (
                            <Image
                              style={{
                                height: 30,
                                width: 30,
                                resizeMode: "contain",
                              }}
                              source={require("./images/logo.png")}
                            />
                          ),
                        }}
                      >
                        {() => <MapScreen setToken={setToken} />}
                      </Stack.Screen>
                      <Stack.Screen
                        name="Room"
                        options={{
                          headerTitle: () => (
                            <Image
                              style={{
                                height: 30,
                                width: 30,
                                resizeMode: "contain",
                              }}
                              source={require("./images/logo.png")}
                            />
                          ),
                        }}
                      >
                        {() => <RoomScreen />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="TabMyProfile"
                  options={{
                    tabBarLabel: "My profile",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons
                        name={"person-outline"}
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Settings"
                        options={{
                          headerTitle: () => (
                            <Image
                              style={{
                                height: 30,
                                width: 30,
                                resizeMode: "contain",
                              }}
                              source={require("./images/logo.png")}
                            />
                          ),
                        }}
                      >
                        {() => (
                          <SettingsScreen setToken={setToken} setId={setId} />
                        )}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
