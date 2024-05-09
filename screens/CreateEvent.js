import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getAuth } from "firebase/auth";
import { ref, onValue, update, get } from "firebase/database";
import db from "../config";
export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      events: [],
      myName: "",
      eventName: "",
      uid: null,
    };
  }

  componentDidMount() {
    const auth = getAuth();
    const uid = auth.currentUser.uid;
    let myName;
    let events = [];

    //Reading all the events from database
    onValue(ref(db, "events"), async (snapshot) => {
      events = (await snapshot.val()) ? snapshot.val() : [];

      this.setState({ events: events });
    });

    //Reading users name
    onValue(ref(db, "users/" + uid), async (snapshot) => {
      myName =
        (await snapshot.val().first_name) + " " + snapshot.val().last_name;
      this.setState({
        myName: myName,
        uid: uid,
      });
    });
  }

  createEvent = async (eventName) => {
    const { uid, myName, events } = this.state;

    let event = {
      creator_id: uid,
      creator_name: myName,
      people: [uid],
      plans: "",
      eventName: eventName,
      id: Math.random().toString(36).slice(2),
    };

    console.log(event);
    update(ref(db, "/"), {
      events: [...events, event],
    });

    Alert.alert("Event created successfully!");
    this.setState({
      eventName: "",
    });
  };

  render() {
    const { eventName } = this.state;
    return (
      <View style={{ backgroundColor: "#2A3D45", flex: 1 }}>
        <TextInput
          style={styles.input}
          placeholder="Enter Event Name"
          onChangeText={(text) => this.setState({ eventName: text })}
          value={this.state.eventName}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.createEvent(eventName)}
        >
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  input: {
    marginTop: 50,
    height: 50,
    width: 200,
    borderColor: "#BCAC9B",
    borderWidth: 1,
    alignSelf:'center',
    textAlign:'center',
    color:'#BCAC9B',
    borderRadius:10,
  },
  button: {
    borderWidth: 1,
    borderColor: "black",
    width: 150,
    height: 50,
    marginTop: 50,
    backgroundColor:'#BCAC9B',
    borderRadius:10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
