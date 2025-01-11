import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login( {route} ) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigation();

  const handleSubmit = async () => {
    const userData = {
        email: email,
        password: password,
    };

    try {
        const res = await axios.post('http://localhost:5001/login', userData);

        // Log response for debugging
        console.log(res.data);

        if (res.data.status === 'Ok') {
            const {token, role} = res.data.data;

            // Save token to AsyncStorage
            await AsyncStorage.setItem('userToken', token);

            alert('Login Successful');

            // Navigate based on role
            if (role === 'Tutor') {
                navigate.navigate('Tutor-Profile', {email}); 
            } else {
                navigate.navigate('Profile', {email});
            }
        } else {
            alert('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Something went wrong');
    }
};

  return (
    <View style={styles.container}>
      <Text style={styles.texts}>Log In</Text>
      <TextInput
        style={styles.input}
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder='Password'
        value={password}
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <Text style={styles.forgotPassword}>Forgot password?</Text>
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.smallTexts}>Login</Text>
      </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    texts:{
      color: '#000000',
      fontSize: 50,
      fontWeight: '900',
      marginBottom: 40
    },
    input: {
      borderColor: '#000000',
      height: 60,
      borderWidth: 1,
      marginTop: 50,
      paddingLeft: 10,
      borderRadius: 9,
      width: '90%',
      backgroundColor: '#d9d9d9',
    },
    forgotPassword: {
      color: 'black',
      marginBottom: 20,
      marginTop: 20,
      marginLeft: 250,
      fontStyle: 'italic',
    },
    button:{
      width: 150,
      height: 50,
      marginTop: 40,
      backgroundColor: '#000000',
      borderRadius: 7,
    },
    smallTexts:{
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
      marginTop: 18
    },
  });