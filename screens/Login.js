import React from 'react';
import { Text,View,StyleSheet,TextInput,TouchableOpacity,Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class Login extends React.Component {
    constructor(){
        super();
        this.state={
            email:'',
            password:''
        }
    }
    signIn = async (email, password) => {
		const auth = getAuth();
		signInWithEmailAndPassword(auth, email, password)
			.then(() => {
				this.props.navigation.replace('Dashboard');
			})
			.catch((error) => {
				Alert.alert(error.message);
			});
	};

    render() {
        const { email, password } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                <Ionicons name='calendar' size={60} style={{alignSelf:'center'}} color={'#BCAC9B'}/>

                    <Text style={styles.titleText}>EVENT PLANNER APP</Text>

                    
                </View>

                <View style={styles.innerContainer}>
                <TextInput style={styles.input}
                placeholder='Enter Email'
                onChangeText={(text)=>this.setState({email:text})}/>
                
                <TextInput style={styles.input}
                placeholder='Enter Password'
                onChangeText={(text)=>this.setState({password:text})}
                secureTextEntry={true}/>

                <TouchableOpacity style={styles.button} onPress={()=>this.signIn(email,password)}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>this.props.navigation.navigate('Register')}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles= StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#2A3D45'
    },
    titleContainer:{
        alignSelf:'center',
        marginTop:100
    },
    titleText:{
        fontSize:30,
        fontWeight:'bold',
        color:'#BCAC9B'
    },
    innerContainer:{
        alignSelf:'center',
        marginTop:50
    },
    input:{
        marginTop:50,
        height:40,
        width:200,
        borderColor:'#BCAC9B',
        borderRadius:10,
        borderWidth:1,
        alignSelf:'center',
        textAlign:'center',
        color:'#BCAC9B',

    },
    button:{
        borderWidth:1,
        borderColor:'black',
        width:100,
        height:40,
        marginTop:50,
        backgroundColor:'#BCAC9B',
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        borderRadius:10
    },
    buttonText:{
        color:'white',
        textAlign:'center',
        fontSize:20,
        fontWeight:'bold',
    }

})