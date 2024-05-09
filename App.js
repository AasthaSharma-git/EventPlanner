
import { StyleSheet, Text, View ,SafeAreaView,Platform,StatusBar} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Dashboard from './navigator/StackNavigator';
import Login from './screens/Login';
import Register from './screens/Register'


const Stack=createStackNavigator();

const StackNavigator=()=>{
  return(
    <SafeAreaView style={{flex:1,marginTop:Platform.OS=='android'?StatusBar.currentHeight:20}}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
  
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <StackNavigator/>
  );
}

