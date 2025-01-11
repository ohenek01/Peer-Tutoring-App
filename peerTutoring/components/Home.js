import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View, Text, StatusBar, TextInput, TouchableOpacity, FlatList } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Home(route) {
  const [userData, setUserData] = useState(null);
  const [tutor, setTutor] = useState([]);
  const navigation = useNavigation()

  const fetchUserProfile = async() => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if(!token){
        throw new Error('Token not found');
      }
      const res = await axios.get('http://172.20.10.6:5001/profile', {
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

  const fetchTutors = async() => {
    try {
      const res = await axios.get('http://172.20.10.6:5001/tutors');
      const randomTutors = res.data.data.sort(() => 0.5 - Math.random());
      setTutor(randomTutors.slice(0, 5));
    } catch (error) {
      console.error('Error finding tutors', error)
    } 
  }

  useEffect(() => {
    const loadData = async() => {
      const data = await fetchUserProfile();
      setUserData(data);
    };
    loadData();

    fetchTutors();
  }, []);

  if(!userData){
    return <Text style={styles.smallTexts}>No user data found</Text>
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome style={styles.icon} name="user-circle-o" size={50} color="black" />
        <Text style={styles.title}>Home</Text>
      </View>
      <Text style={styles.greetings}> Hello, {userData.fname}</Text>
      <TouchableOpacity style={styles.inputContainer} onPress={() => navigation.navigate('Search')}>
      <FontAwesome
      name='search'
      size={20}
      color={'gray'}
      style={styles.icon1}
      />
      <View style={styles.input}>
        <Text style={styles.placeholder}>Search...</Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.subHeading}>Recommended Tutors</Text>
      </TouchableOpacity>
      <FlatList
      horizontal
      data={tutor}
      keyExtractor={(item) => item._id}
      renderItem={({item}) => (
        <TouchableOpacity style={styles.tutorCard}>
          <FontAwesome style={styles.icon2} name='user-circle-o' size={24}/>
          <Text style={styles.text1}>{item.fname}</Text>
          <Text style={styles.texts}>{item.level}</Text>
          <Text style={styles.texts}>{item.expertise}</Text>
        </TouchableOpacity>
      )}
      />
      <StatusBar barStyle="dark-content" />
    </View>
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
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginLeft: 20,
    },
    subHeading:{
      fontWeight: 'bold',
      marginTop: 40,
      marginLeft: 20
    },
    icon1:{
      position: 'absolute',
      top: 45,
      left: 18,
      transform: [{ translateY: -10 }],
      zIndex: 1
    },
    icon2:{
      position: 'absolute',
      top: 20,
      left: 100
    },
    placeholder:{
      marginTop: 15,
      color: 'gray',
      fontSize: 17,
      marginLeft: 10,
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
    tutorCard:{
      width: 200,
      height: 163,
      backgroundColor: '#d9d9d9',
      borderRadius: 50,
      justifyContent: 'center',
      paddingLeft: 20,
      marginTop: 20,
      marginLeft: 20
    },
    text1:{
      fontWeight: 'bold',
      textAlign: 'center'
    },
    texts:{
      color: 'black',
    },
  });