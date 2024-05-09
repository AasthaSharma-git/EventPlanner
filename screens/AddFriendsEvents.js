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
      eventId: this.props.route.params.id,
      people: [],
      event: "",
    };
  }
  fetchFriends = async () => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const { eventId } = this.state;
    let people = [];

    var dbRef1 = ref(db, "events");

    onValue(dbRef1, (snapshot) => {
      let temp = snapshot.val();
      if (temp) {
        let people = {};
        temp.map((item) => {
          if (item.id == eventId) {
            people = item.people;
            this.setState({ event: item, people: item.people });
          }
        });
        var dbRef2 = ref(db, "users/" + userId);

        onValue(dbRef2, (snapshot) => {
          let temp = snapshot.val().myFriends ? snapshot.val().myFriends : [];
          let myFriends = [];

          temp.map((key) => {
            if (!people.includes(key)) {
              onValue(ref(db, "users/" + key), (snapshot) => {
                myFriends.push({
                  key: key,
                  value: snapshot.val(),
                });
              });
            }
          });
          this.setState({ myFriends: myFriends });
        });
      }
    });
  };
  componentDidMount() {
    this.fetchFriends();
  }

  handleAddFriend = async (friendKey) => {
    try {
      const { eventId } = this.state;
      const auth = getAuth();
      const userId = auth.currentUser.uid;

      // Fetch the event
      const eventsSnapshot = await get(ref(db, "/events"));
      let event;
      let eventKey;
      eventsSnapshot.forEach((eventSnapshot, index) => {
        const e = eventSnapshot.val();
        if (e.id === eventId) {
          event = e;
          eventKey = eventSnapshot.key;
        }
      });

      // Update the event's people array
      const dbRef = ref(db, "/events/" + eventKey);
      const updatedPeople = [...event.people, friendKey];
      await update(dbRef, { people: updatedPeople });

      // Update the state
      this.setState((prevState) => ({
        people: [...prevState.people, friendKey],
      }));
    } catch (error) {
      console.error("Error adding friend:", error);
      // Handle error (e.g., show an alert)
      Alert.alert("Error", "Failed to add friend. Please try again.");
    }
  };

  renderItem = ({ item }) => {
    const { eventId } = this.state;

    return (
      <View
        style={{
          justifyContent: "center",
          borderRadius: 10,
          backgroundColor: "#C17C74",
          alignSelf: "center",
          height: 100,
          width: 250,
          marginTop: 25,
        }}
      >
        <Text style={{ alignSelf: "center", color: "#DDC9B4", fontSize: 20 }}>
          {item.value.first_name + " " + item.value.last_name}
        </Text>
        <View style={{ width: 100, alignSelf: "center", marginTop: 10 }}>
          <Button
            onPress={() => this.handleAddFriend(item.key)}
            title="Add"
            color="#7A6C5D"
          />
        </View>
      </View>
    );
  };

  render() {
    if (this.state.myFriends.length === 0) {
      return (
        <View style={{ backgroundColor: "#2A3D45", flex: 1 }}>
          <Text
            style={{ alignSelf: "center", marginTop: 100, color: "#DDC9B4" }}
          >
            Add Friends!
          </Text>
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
