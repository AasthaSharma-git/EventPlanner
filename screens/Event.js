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
      events: [],
    };
  }

  fetchEvents = () => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;

    onValue(ref(db, "/events"), (snapshot) => {
      temp = snapshot.val();

      if (temp) {
        let events = [];
        temp.map((item) => {
          if (item.people.includes(userId)) {
            events.push(item);
          }
        });

        this.setState({ events: events });
      }
    });
  };
  componentDidMount() {
    this.fetchEvents();
  }
  renderItem = ({ item }) => {
    return (
      <View
        style={{
          justifyContent: "center",
          borderRadius: 10,
          backgroundColor: "#C17C74",
          alignSelf: "center",
          height: 200,
          width: 350,
          marginTop: 25,
        }}
      >
        <Text style={{ alignSelf: "center", color: "#DDC9B4", fontSize: 20 }}>
          {item.eventName}
        </Text>

        <View style={{width:100,alignSelf:'center',marginTop:10}}>
          <Button
            onPress={() => {
              this.props.navigation.navigate("Plan", { id: item.id });
            }}
            title="PLAN"
            color='#7A6C5D'
          />
        </View>

        <View style={{width:200,alignSelf:'center',marginTop:10}}>
          <Button
            onPress={() => {
              this.props.navigation.navigate("AddFriendsEvents", {
                id: item.id,
              });
            }}
            title="Add Friends to event"
            color='#7A6C5D'
          />
        </View>
      </View>
    );
  };

  render() {
    if (this.state.events.length == 0) {
      return (
        <View style={{ backgroundColor: "#2A3D45", flex: 1 }}>
          <Text
            style={{ alignSelf: "center", marginTop: 100, color: "#DDC9B4" }}
          >
            No Events!
          </Text>
        </View>
      );
    } else {
      return (
        <View style={{ backgroundColor: "#2A3D45", flex: 1 }}>
          <FlatList data={this.state.events} renderItem={this.renderItem} />
        </View>
      );
    }
  }
}
