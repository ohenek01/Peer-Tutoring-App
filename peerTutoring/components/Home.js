import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View, Text, StatusBar, TextInput } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home(route) {
  const [userData, setUserData] = useState(null);


  const fetchUserProfile = async() => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if(!token){
        throw new Error('Token not found');
      }
      const res = await axios.get('http://localhost:5001/profile', {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      return res.data.data;
    } catch (error) {
      console.error('Error fetching user data', error)
      throw error;
    }
  }

  useEffect(() => {
    const loadData = async() => {
      const data = await fetchUserProfile();
      setUserData(data);
    };
    loadData();
  }, []);

  if(!userData){
    return <Text style={styles.smallTexts}>No user data found</Text>
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome style={styles.icon}name="user-circle-o" size={50} color="black" />
        <Text style={styles.title}>Home</Text>
      </View>
      <Text style={styles.greetings}> Hello {userData.fname}</Text>
      <View style={styles.inputContainer}>
      <FontAwesome
      name='search'
      size={20}
      color={'gray'}
      // style={styles.icon1}
      />
      <TextInput 
      // style={styles.input}
      placeholder='Search'
      />
      </View>
      <StatusBar barStyle="dark-content" />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header:{
      flexDirection: 'row',  
      alignItems: 'center',  
    },
    title: {
      fontSize: 40,
      color: 'black',
      fontWeight: '900',
      textAlign: 'center',
      marginTop: 80,
      marginBottom: 50
    },
    icon:{
      marginTop: 26,
      marginRight: 100,
      marginLeft: 15,
    },
    inputContainer:{
      backgroundColor: '#d9d9d9',
      marginLeft: 24,
      paddingVertical: 16,
      paddingHorizontal: 24,
      marginTop: 16,
      borderRadius: 8, 
      borderRadius: 8,
      width: '90%',
      flexDirection: 'row',
    },
    icon1:{
      position: 'absolute',
      top: '50%',
      left: 30,
      transform: [{ translateY: -10 }],
    },
    greetings:{
      fontWeight: 'bold',
      fontSize: 20,
      marginLeft: 21,
    },
    input: {
      borderColor: '#000000',
      height: 53,
      borderWidth: 1,
      marginTop: 20,
      paddingLeft: 40,
      borderRadius: 30,
      width: '90%',
      backgroundColor: '#d9d9d9',
    },
  });