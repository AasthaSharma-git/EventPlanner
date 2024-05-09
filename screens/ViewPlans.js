import React from "react";
import {View, Text, FlatList, Button, Alert } from "react-native";
import { getAuth } from "firebase/auth";
import { ref, onValue, update, get } from "firebase/database";
import db from "../config";
import { Card, Icon } from "@rneui/themed";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myPlans: [],
      names: [],
      myFriends: [],
      voted: [],
      eventId: this.props.route.params.id,
      eventIndex:''
    };
  }

  fetchPlans = () => {
    const { eventId } = this.state;
    const auth = getAuth();
    const userId = auth.currentUser.uid;

    onValue(ref(db, "events"), (snapshot) => {
      let temp = snapshot.val();
      let myPlans = [];
      var voted=[]
      temp.map((item,index) => {
        if (item.id == eventId) {
          this.setState({eventIndex:index})
         
          item.plans.map((plan) => {
            console.log(plan)
            if(plan.votes.includes(userId)) {
             
              voted.push('#7A6C5D')
            }
            else{
           
              voted.push('#DDC9B4')
            }
            
            myPlans.push(plan);
          });
        }
      });
   

      this.setState({ myPlans: myPlans,voted:voted });
    });
  };
  componentDidMount() {
    this.fetchPlans();
  }
  renderItem = ({ item, index }) => {
    const {eventIndex}=this.state;
    const auth = getAuth();
    const userId = auth.currentUser.uid;

    return (
      <View style={{
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: "#C17C74",
        alignSelf: "center",
        height: 200,
        width: 350,
        marginTop: 45,
       
      }}>
        <Text style={{ alignSelf: "center", color: "#DDC9B4",fontSize:20,marginBottom:20 }}>{"Suggested by: " + item.creator_name}</Text>
        <Text style={{ alignSelf: "center", color: "#DDC9B4"}}>{"Venue: " + item.venue}</Text>
        <Text style={{ alignSelf: "center", color: "#DDC9B4"}}>{"Date: " + item.date.toString()}</Text>
        <Text style={{ alignSelf: "center", color: "#DDC9B4"}}>{"Time: " + item.time.toString()}</Text>
        <Text style={{ alignSelf: "center", color: "#DDC9B4"}}>{"Votes: " + item.votes.length}</Text>
       
        <View style={{width:100,alignSelf:'center',marginTop:10,borderRadius:10}}>
        <Button
          onPress={() => {
            if(this.state.voted[index]=='#DDC9B4'){
              var dbRef=ref(db,'events/'+eventIndex+'/plans/'+index)
              var votes;
              onValue(dbRef,(snapshot)=>{
               
                 votes=snapshot.val().votes?snapshot.val().votes:[]
              })
             
              update(dbRef,{
               votes:[...votes,userId]
              })
            }
            else{
              var dbRef=ref(db,'events/'+eventIndex+'/plans/'+index)
              var votes;
              onValue(dbRef,(snapshot)=>{
               
                 votes=snapshot.val().votes?snapshot.val().votes:[]
              })

              votes=votes.filter(item=>item != userId)
             
              update(dbRef,{
               votes:votes.length!=0?[...votes]:""
              })
            }
          
          }}
          color={this.state.voted[index]}
          title={this.state.voted[index]=='#7A6C5D'?'Disagree':'Agree'}
        />
        </View>
      </View>
    );
  };
  keyExtractor = (item, index) => {
    return index.toString();
  };

  render() {
    if(this.state.myPlans.length==0){
      return(
        <View style={{ backgroundColor: "#2A3D45", flex: 1 }}>
          <Text style={{ alignSelf: "center", marginTop: 100, color: "#DDC9B4" }}>No Plans Available</Text>
        </View>
      )
    }
    else{
      return(
        <View style={{ backgroundColor: "#2A3D45", flex: 1 }}>
        <FlatList
          data={this.state.myPlans}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
        </View>
      )
    }
    
  }
}
