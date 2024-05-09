import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
import Plan from '../screens/Plan'
import ViewPlans from '../screens/ViewPlans';
import AddFriendsEvents from '../screens/AddFriendsEvents';


const Stack = createStackNavigator();

export default class StackNavigator extends React.Component{
    render(){
        return(
            <Stack.Navigator screenOptions={{headerShown:false}}>
                <Stack.Screen name="DrawerNavigator" component={DrawerNavigator}/>
                <Stack.Screen name="Plan" component={Plan}/>
                <Stack.Screen name="ViewPlans" component={ViewPlans}/>
                <Stack.Screen name="AddFriendsEvents" component={AddFriendsEvents}/>
            </Stack.Navigator>
        );
    }

}