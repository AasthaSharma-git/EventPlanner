import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MyFriends from "../screens/MyFriends";
import Request from "../screens/Request";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

export default class TabNavigator extends React.Component {
  render() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#C17C74",
            height: 60,
            position: "absolute",
          },
          tabBarLabelStyle:{fontSize:15},
          tabBarActiveTintColor: "#DDC9B4",
          tabBarInactiveTintColor: "#BCAC9B",
         
        }}
      >
        <Tab.Screen
          name="My Friends"
          component={MyFriends}
          options={{
            tabBarIcon: ({focused, color, size }) => (
              <Ionicons name={focused?"people":"people-outline"} color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen name="Requests" component={Request}
         options={{
            tabBarIcon: ({focused, color, size }) => (
              <Ionicons name={focused?"person-add":"person-add-outline"} color={color} size={size} />
            ),
          }} />
      </Tab.Navigator>
    );
  }
}
