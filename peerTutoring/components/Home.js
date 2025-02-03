import React, { useEffect, useState } from 'react'
import { Platform, StyleSheet, View, Text, StatusBar, TextInput, TouchableOpacity, FlatList,ScrollView } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import SearchPage from './SearchPage';

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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <FontAwesome style={styles.icon} name="user-circle-o" size={50} color="black" />
        <Text style={styles.title}>Home</Text>
      </View>
      <Text style={styles.greetings}> Hello, {userData.fname}</Text>
      <TouchableOpacity style={styles.inputContainer} onPress={() => navigation.navigate('TabNavigator', { screen: 'Search' })}>
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
      <TouchableOpacity style={styles.subContainer} onPress={() => navigation.navigate('TutorPage')}>
        <Text style={styles.subHeading}>Recommended Tutors</Text>
        <Entypo name="chevron-down" size={24} color="black" style={styles.subIcon}/>
      </TouchableOpacity>
      <View style={{ height: 200 }}>
      <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={tutor}
      keyExtractor={(item) => item._id}
      renderItem={({item}) => (
        <TouchableOpacity onPress={() => navigation.navigate('TutorDetailScreen', {tutor: item, userName: userData.fname, userEmail: userData.email})} style={styles.tutorCard}>
          <FontAwesome style={styles.icon2} name='user-circle-o' size={24}/>
          <Text style={styles.text1}>{item.fname}</Text>
          <Text style={styles.texts}>{item.level}</Text>
          <Text style={styles.texts}>{item.expertise}</Text>
        </TouchableOpacity>
      )}
      />
      </View>
        <Text style={styles.subHeading1}>Suggested Courses:</Text>
        <View style={styles.suggestedCourses}>
          <TouchableOpacity onPress={() => {navigation.navigate('Search', { searchQuery: 'Calculus I' })}} style={styles.courseContainer}><Text style={styles.text1}>Calculus I</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {navigation.navigate('Search', { searchQuery: 'Calculus II' })}} style={styles.courseContainer}><Text style={styles.text1}>Calculus II</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {navigation.navigate('Search', { searchQuery: 'Calculus III' })}} style={styles.courseContainer}><Text style={styles.text1}>Calculus III</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {navigation.navigate('Search', { searchQuery: 'Algebra and Trigonometry' })}} style={styles.courseContainer}><Text style={styles.text1}>Algebra and Trigonometry</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {navigation.navigate('Search', { searchQuery: 'Vectors and Geometry' })}} style={styles.courseContainer}><Text style={styles.text1}>Vectors and Geometry</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {navigation.navigate('Search', { searchQuery: 'BioChemistry' })}} style={styles.courseContainer}><Text style={styles.text1}>BioChemistry </Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {navigation.navigate('Search', { searchQuery: 'Vectors and Mechanics' })}} style={styles.courseContainer}><Text style={styles.text1}>Vectors and Mechanics </Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {navigation.navigate('Search', { searchQuery: 'Discrete Mathematics' })}} style={styles.courseContainer}><Text style={styles.text1}>Discrete Mathematics</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {navigation.navigate('Search', { searchQuery: 'Differential Equations' })}} style={styles.courseContainer}><Text style={styles.text1}>Differential Equations</Text></TouchableOpacity>
        </View>
      <StatusBar barStyle="dark-content" />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingBottom: 20,
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
    subHeading1:{
      fontWeight: 'bold',
      marginTop: 35,
      marginLeft: 20,
      marginBottom: 20
    },
    suggestedCourses:{
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around'
    },
    courseContainer:{
      width: 122,
      height: 52,
      borderRadius: 10,
      backgroundColor: '#d9d9d9',
      marginBottom: 20,
      paddingTop: 10
    }
  });