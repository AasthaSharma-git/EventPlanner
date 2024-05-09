import React from "react";
import { Text, FlatList, View, StyleSheet, Button } from "react-native";
import { getAuth } from "firebase/auth";
import { ref, onValue, update } from "firebase/database";
import db from "../config";
import { Card, Icon } from "@rneui/themed";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      myFriends: [],
      myRequests: [],
      sentRequests: [],
      uid: null,
    };
  }

  fetchAllUsers = () => {
    //Read current user uid
    const auth = getAuth();
    const userId = auth.currentUser.uid;

    //Read current users's friends, sent requests and recieved requests
    onValue(ref(db, "/users/" + userId), (snapshot) => {
      let myFriends = snapshot.val().myFriends ? snapshot.val().myFriends : [];
      let myRequests = snapshot.val().requests ? snapshot.val().requests : [];
      let sentRequests = snapshot.val().sentRequests
        ? snapshot.val().sentRequests
        : [];

      this.setState({
        myRequests: myRequests,
        myFriends: myFriends,
        sentRequests: sentRequests,
        uid: userId,
      });

      onValue(ref(db, "/users/"), (snapshot) => {
        let users = [];
        if (snapshot.val()) {
          Object.keys(snapshot.val()).forEach(function (key) {
            if (
              !myFriends.includes(key) &&
              !myRequests.includes(key) &&
              !sentRequests.includes(key) &&
              userId != key
            ) {
              users.push({
                key: key,
                value: snapshot.val()[key],
              });
            }
          });
        }
        this.setState({ users: users });
      });
    });
  };

  componentDidMount() {
    this.fetchAllUsers();
  }
  renderItem = ({ item }) => {
    const { uid, sentRequests, myRequests } = this.state;

    return (
      <View style={{
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: "#C17C74",
        alignSelf: "center",
        height: 100,
        width: 250,
        marginTop: 25,
       
      }}>
        <Text style={{ alignSelf: "center", color: "#DDC9B4",fontSize:20 }}>
          {item.value.first_name + " " + item.value.last_name}
        </Text>
        
        <View style={{width:100,alignSelf:'center',marginTop:10}}>
        <Button
          onPress={() => {
            const dbRef1 = ref(db, "/users/" + uid);

            update(dbRef1, {
              sentRequests: [...sentRequests, item.key],
            });

            const dbRef2 = ref(db, "/users/" + item.key);

            update(dbRef2, {
              requests: [...myRequests, uid],
            });
          }}
          title="ADD"
          color='#7A6C5D'
          
        />
        </View>
      </View>
    );
  };

  render() {
    if (this.state.users.length == 0) {
      return (
        <View style={{ backgroundColor: "#2A3D45", flex: 1  }}>
          <Text style={{alignSelf:'center',marginTop:100, color: "#DDC9B4"}}>No Friends available to add!</Text>
        </View>
      );
    }
    return (
      <View style={{ backgroundColor: "#2A3D45", flex: 1 }}>
        <FlatList data={this.state.users} renderItem={this.renderItem} />
      </View>
    );
  }
}
