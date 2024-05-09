import React from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import { getAuth } from "firebase/auth";
import { ref, onValue, update, get } from "firebase/database";
import db from "../config";
import { Card, Icon } from "@rneui/themed";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myFriends: [],
    };
  }

  fetchFriends = async () => {
    try {
      const auth = getAuth();
      const userId = auth.currentUser.uid;

      const snapshot = await get(ref(db, "/users/" + userId));
      const temp = snapshot.val().myFriends || [];
      let myFriends = [];

      // Use Promise.all to wait for all asynchronous operations to complete
      await Promise.all(
        temp.map(async (key) => {
          const userSnapshot = await get(ref(db, "/users/" + key));
          myFriends.push({
            key: key,
            value: userSnapshot.val(),
          });
        })
      );

      this.setState({ myFriends: myFriends });
    } catch (error) {
      console.error("Error fetching friends:", error);
      // Handle error (e.g., show an alert)
      Alert.alert("Error", "Failed to fetch friends. Please try again.");
    }
  };
  componentDidMount() {
    this.fetchFriends();
  }
  renderItem = ({ item }) => {
    return (
      <View
        style={{
          justifyContent: "center",
          borderRadius: 10,
          backgroundColor: "#C17C74",
          alignSelf: "center",
          height: 50,
          width: 250,
          marginTop: 25,
        }}
      >
        <Text style={{ alignSelf: "center", color: "#DDC9B4",fontSize:20 }}>
          {item.value.first_name + " " + item.value.last_name}
        </Text>
      </View>
    );
  };

  render() {
    if (this.state.myFriends.length == 0) {
      return (
        <View style={{ backgroundColor: "#2A3D45", flex: 1 }}>
          <Text style={{alignSelf:'center',marginTop:100, color: "#DDC9B4"}}>Add Friends!</Text>
        </View>
      );
    } else {
      return (
        <View style={{ backgroundColor: "#2A3D45", flex: 1 }}>
          <FlatList data={this.state.myFriends} renderItem={this.renderItem} />
        </View>
      );
    }
  }
}
