import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import db from "../config";
export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  }

  registerUser = (email, password, confirmPassword, first_name, last_name) => {
    if (password == confirmPassword) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          Alert.alert("User registered!!");

          this.props.navigation.replace("Login");

          const dbRef = ref(db, "/users/" + userCredential.user.uid);

          set(dbRef, {
            email: userCredential.user.email,
            first_name: first_name,
            last_name: last_name,
            groups: "",
            requests: "",
            myFriends: "",
            myEvents: "",
            sentRequests: "",
            plans: "",
          });
        })
        .catch((error) => {
          Alert.alert(error.message);
        });
    } else {
      Alert.alert("Passwords don't match!");
    }
  };
  render() {
    const { first_name, last_name, email, password, confirmPassword } =
      this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#2A3D45" }}>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>REGISTER</Text>
        </View>

        <View style={styles.innerContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter First Name"
            onChangeText={(text) => this.setState({ first_name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Last Name"
            onChangeText={(text) => this.setState({ last_name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            onChangeText={(text) => this.setState({ email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            onChangeText={(text) => this.setState({ password: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            onChangeText={(text) => this.setState({ confirmPassword: text })}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              this.registerUser(
                email,
                password,
                confirmPassword,
                first_name,
                last_name
              )
            }
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  innerContainer: {
    alignSelf: "center",
    marginTop: 20,
  },
  titleContainer: {
    alignSelf: "center",
    marginTop: 100,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#BCAC9B",
  },
  input: {
    marginTop: 50,
    height: 40,
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
    width: 100,
    height: 40,
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
