import React from "react";
import { Text} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

import TabNavigator from "./TabNavigator";
import CreateEvent from "../screens/CreateEvent";
import AddFriends from "../screens/AddFriends";
import Event from "../screens/Event";
import Logout from "../screens/Logout";
import Ionicons from "react-native-vector-icons/Ionicons";


const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <Ionicons name='calendar' size={50} style={{alignSelf:'center'}} color={'#2A3D45'}/>
        <Text style={{alignSelf:'center',marginTop:20,fontSize:25,color:'#2A3D45'}}>EVENT PLANNER APP</Text>
        
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  }

export default class DrawerNavigator extends React.Component {
  render() {
    return (
      <Drawer.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#C17C74" },
          drawerStyle: { backgroundColor: "#C17C74" },
          drawerLabelStyle: {
            color: "#DDC9B4",
          },
          headerTitleStyle: { color: "#DDC9B4" },
          drawerActiveTintColor: "white",
          drawerInactiveTintColor:'#2A3D45',
          drawerType:'slide'
        }}
        drawerContent={(props)=><CustomDrawerContent {...props}/>}
      >
        <Drawer.Screen
          name="Home"
          component={TabNavigator}
          options={{
            drawerIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Add Friends"
          component={AddFriends}
          options={{
            drawerIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "person-add" : "person-add-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Create Events"
          component={CreateEvent}
          options={{
            drawerIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "create" : "create-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="My Events"
          component={Event}
          options={{
            drawerIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "list-circle" : "list-circle-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Logout"
          component={Logout}
          options={{
            drawerIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "log-out" : "log-out-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
      </Drawer.Navigator>
    );
  }
}
