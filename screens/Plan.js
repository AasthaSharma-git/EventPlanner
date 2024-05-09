import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getAuth } from "firebase/auth";
import { ref, onValue, update, get } from "firebase/database";
import db from "../config";

export default class Plan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      mode: "time",
      show: false,
      venue: "",
      time: new Date(),
      myFriends: "",
      plans: "",
      eventId: this.props.route.params.id,
      myName: "",
    };
  }
  componentDidMount() {
    const auth = getAuth();
    const uid = auth.currentUser.uid;
    onValue(ref(db, "/users/" + uid), (snapshot) => {
      this.setState({
        myName: snapshot.val().first_name + " " + snapshot.val().last_name,
      });
    });
  }
  onChangeDate = (event, obj) => {
    this.setState({ date: obj, show: false });
  };
  onChangeTime = (event, obj) => {
    this.setState({ time: obj, show: false });
  };
  addPlan = (date, time, venue) => {
    const { eventId, myName } = this.state;
    const auth = getAuth();
    const uid = auth.currentUser.uid;
    let temp = {
      date: date.toDateString(),
      time: time.toTimeString(),
      venue: venue,
      creator_id: uid,
      votes: "",
      creator_name: myName,
    };

    const dbRef1 = ref(db, "events");
    var plans;
    var key;
    onValue(dbRef1, (snapshot) => {
      var events = snapshot.val();

      events.map((item, index) => {
        if (item.id == eventId) {
          key = index;
          plans = snapshot.val()[key].plans ? snapshot.val()[key].plans : [];
        }
      });
    });

    update(ref(db, "events/" + key), {
      plans: [...plans, temp],
    });
    Alert.alert("Plan added successfully!");
    this.setState({
      date: new Date(),
      mode: "time",
      show: false,
      venue: "",
      time: new Date(),
      myFriends: "",
      plans: "",
    });
  };

  render() {
    const { mode, show, date, time, venue } = this.state;

    return (
      <View style={{ backgroundColor: "#2A3D45", flex: 1 }}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>PLAN</Text>
        </View>

        <View style={styles.innerContainer}>
          <TextInput
            value={venue}
            style={styles.input}
            placeholder="Enter venue"
            onChangeText={(text) => {
              this.setState({ venue: text });
            }}
          />

          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <TextInput value={date.toDateString()} style={styles.input} />
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                this.setState({
                  show: true,
                  mode: "date",
                })
              }
            >
              <Text style={styles.buttonText}>Select Date</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <TextInput value={time.toTimeString()} style={styles.input} />
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                this.setState({
                  show: true,
                  mode: "time",
                })
              }
            >
              <Text style={styles.buttonText}>Select Time</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.addPlan(date, time, venue)}
          >
            <Text style={styles.buttonText}>Add Plan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              this.props.navigation.navigate("ViewPlans", {
                id: this.state.eventId,
              })
            }
          >
            <Text style={styles.buttonText}>View Plans</Text>
          </TouchableOpacity>

          {show && mode == "time" ? (
            <DateTimePicker
              testID="dateTimePicker"
              value={time}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={this.onChangeTime}
            />
          ) : undefined}

          {show && mode == "date" ? (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              onChange={this.onChangeDate}
            />
          ) : undefined}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    alignSelf: "center",
    marginTop: 100,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    color: "#DDC9B4",
  },
  innerContainer: {
    marginTop: 50,
  },

  input: {
    marginTop: 50,
    height: 50,
    width: 200,
    borderColor: "#BCAC9B",
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: "center",
    textAlign: "center",
    color: "#BCAC9B",
  },
  button: {
    borderWidth: 1,
    borderColor: "black",
    width: 120,
    height: 50,
    marginTop: 50,
    backgroundColor: "#BCAC9B",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
