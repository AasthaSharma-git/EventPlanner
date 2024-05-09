import React from "react";
import { View, Text, FlatList, Button } from "react-native";
import { getAuth } from "firebase/auth";
import { ref, onValue, update, get } from "firebase/database";
import db from "../config";
import { Card, Icon } from "@rneui/themed";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myRequests: [],
    };
  }

  fetchRequests = () => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    let temp;

    onValue(ref(db, "/users/" + userId), (snapshot) => {
      temp = snapshot.val().requests ? snapshot.val().requests : [];
      let users = [];
      if(temp){

        temp.map((key) => {
          onValue(ref(db, "/users/" + key), (snapshot) => {
            users.push({
              key: key,
              value: snapshot.val(),
            });
          });
        });
        this.setState({ myRequests: users });
        
      }
     
    });
  };

  componentDidMount() {
    this.fetchRequests();
  }
  renderItem = ({ item }) => {
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
            const auth = getAuth();
            const uid = auth.currentUser.uid;
            const dbRef1 = ref(db, "/users/" + uid);
            const dbRef2 = ref(db, "/users/" + item.key);

            var myRequests = [];
            var sentRequests = [];
            var myFriends1 = [];
            var myFriends2 = [];
            get(dbRef1, (snapshot) => {
              myRequests = snapshot.val().requests;
            });
            get(dbRef2, (snapshot) => {
              sentRequests = snapshot.val().sentRequests;
            });
            onValue(dbRef1, (snapshot) => {
              myFriends1 = snapshot.val().myFriends;
            });
            onValue(dbRef2, (snapshot) => {
              myFriends2 = snapshot.val().myFriends;
            });
            myRequests = myRequests.filter((item) => item !== item.key);
            sentRequests = sentRequests.filter((item) => item !== uid);

            update(dbRef1, {
              requests: myRequests.length != 0 ? [...myRequests] : "",
              myFriends: [...myFriends1, item.key],
            });

            update(dbRef2, {
              sentRequests: sentRequests.length != 0 ? [...sentRequests] : "",
              myFriends: [...myFriends2, uid],
            });
          }}
          title="ACCEPT"
          color='#7A6C5D'
        />
        </View>
      </View>
    );
  };

  render() {
    if (this.state.myRequests.length == 0) {
      return (
        <View style={{ flex: 1, backgroundColor: "#2A3D45" }}>
          <Text
            style={{ alignSelf: "center", marginTop: 100, color: "#DDC9B4" }}
          >
            No Pending Requests
          </Text>
        </View>
      );
    }
    return (
      <View style={{ backgroundColor: "#2A3D45", flex: 1 }}>
        <FlatList data={this.state.myRequests} renderItem={this.renderItem} />
      </View>
    );
  }
}
