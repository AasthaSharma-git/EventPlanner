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
    const auth = getAuth();
      const userId = auth.currentUser.uid;

      var dbRef = ref(db, "/users/" + userId);

      onValue(dbRef, (snapshot) => {
        temp = snapshot.val().myFriends;
        let myFriends = [];
        if (temp) {
          Promise.all(
            temp.map((key) => {
              return new Promise((resolve, reject) => {
                onValue(ref(db, "/users/" + key), (snapshot) => {
                  myFriends.push({
                    key: key,
                    value: snapshot.val(),
                  });
                  resolve();
                });
              });
            })
          ).then(() => {
            this.setState({ myFriends: myFriends});
          });
        }
      });
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
