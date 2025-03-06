import { useNavigation } from '@react-navigation/native';
import React, { Component, useState, useEffect } from 'react'
import { Text, View, StyleSheet, Platform, TouchableOpacity, FlatList, StatusBar } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TutorHome  (){
    const [userData, setUserData] = useState(null);
    const [learner, setLearner] = useState([]);
    const navigation = useNavigation();

    const fetchUserProfile = async() => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          if(!token){
            throw new Error('Token not found');
          }
          const res = await axios.get('http://192.168.0.102:5001/profile', {
            headers:{
              Authorization: `Bearer ${token}`
            }
          });
          return res.data.data;
        } catch (error) {
          console.error('Error fetching user data', error)
          throw error;
        }
      };

      const fetchLearners = async () => {
        try {
            const res = await axios.get('http://192.168.0.102:5001/learners');
            setLearner(res.data.data)
        } catch (error) {
            console.error('Error fetching Learners:', error)
        }
      }

      useEffect(() => {
          const loadData = async() => {
            const data = await fetchUserProfile();
            setUserData(data);
          };
          loadData();
      
          fetchLearners();
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
        <TouchableOpacity style={styles.subContainer} onPress={() => navigation.navigate('LearnerPage')}>
          <Text style={styles.subHeading}>Learners</Text>
          <Entypo name="chevron-down" size={24} color="black" style={styles.subIcon}/>
        </TouchableOpacity>
        <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={learner}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => navigation.navigate('LearnerDetailScreen', {tutor: item, userName: userData.fname, userEmail: userData.email})} style={styles.tutorCard}>
            <FontAwesome style={styles.icon2} name='user-circle-o' size={24}/>
            <Text style={styles.text1}>{item.fname}</Text>
            <Text style={styles.texts}>{item.level}</Text>
            <Text style={styles.texts}>{item.course}</Text>
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
        marginTop: Platform.OS === 'android' ? -40 : undefined
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
        marginTop: 35,
        marginLeft: 20
      },
      subContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      subIcon:{
        marginTop: 30
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

