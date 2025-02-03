import React, { useEffect, useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, StyleSheet, Text, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Tutorprofile({ route }) {
  const { email }= route.params;
  const [level, setLevel] = useState('');
  const [course, setCourse] = useState('');
  const [userData, setUserData] = useState(null);
  const [expertise, setExpertise] = useState('');
  const [availability, setAvailability] = useState([]);
  const navigate = useNavigation();

  const handleSubmit = () => {
    if(!level || !course || !expertise || !availability){
      alert('Level and Course fields are required');
      return;
    }

    const userData = { email, level, course, expertise, availability};

    axios.put('http://172.20.10.6:5001/profile', userData)
    .then(res => {
      if(res.data.status === 'Ok'){
        Alert.alert('Success', 'Welcome!')
        navigate.replace('TutorHome')
      }
    })
    .catch(error => {
      console.error(error)
      Alert.alert('Error', 'Something went wrong')
    })
  }

  const toggleAvailability = (day) => {
    setAvailability((prevAvailability) => {
      if (prevAvailability.includes(day)) {
        return prevAvailability.filter((d) => d !== day);
      } else {
        return [...prevAvailability, day];
      }
    });
  };

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

          useEffect(() => {
            const loadData = async() => {
              const data = await fetchUserProfile();
              setUserData(data);
            };
            loadData();
          }, []);

          if(!userData){
            return <Text>No user data found</Text>
          }

  return (
      <ScrollView contentContainerStyle={{alignItems: 'center'}} style={styles.container}>
        <Text style={styles.texts}>Profile</Text>
        <FontAwesome style={styles.icon}name="user-circle-o" size={100} color="black" />
        <Text style={styles.smallTexts}>Name:</Text>
        <TextInput style={styles.input}
          value={`${userData.fname} ${userData.lname}`}
        />
        <Text style={styles.smallTexts}>Level:</Text>
        <TextInput style={styles.input}
          placeholder='100'
          value={level}
          onChangeText={setLevel}
        />
        <Text style={styles.smallTexts}>Course:</Text>
        <TextInput style={styles.input}
          placeholder='Mathematical Science'
          value={course}
          onChangeText={setCourse}
        />
        <Text style={styles.smallTexts}>Expertise:</Text>
        <TextInput style={styles.input}
          placeholder='Calculus'
          value={expertise}
          onChangeText={setExpertise}
        />
        <Text style={styles.smallTexts}>Availability:</Text>
        <View style={styles.availability}>
        <TouchableOpacity style={styles.button1} onPress={() => toggleAvailability('Monday')}>
          <Text style={styles.buttonTexts}>Monday</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1} onPress={() => toggleAvailability('Tuesday')}>
          <Text style={styles.buttonTexts}>Tuesday</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1} onPress={() => toggleAvailability('Wednesday')}>
          <Text style={styles.buttonTexts}>Wednesday</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1} onPress={() => toggleAvailability('Thursday')}>
          <Text style={styles.buttonTexts}>Thursday</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1} onPress={() => toggleAvailability('Friday')}>
          <Text style={styles.buttonTexts}>Friday</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1} onPress={() => toggleAvailability('Saturday')}>
          <Text style={styles.buttonTexts}>Saturday</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1} onPress={() => toggleAvailability('Sunday')}>
          <Text style={styles.buttonTexts}>Sunday</Text>
        </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.smallTexts1}>Save and Continue</Text>
        </TouchableOpacity>
        </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    texts:{
      color: '#000000',
      fontSize: 30,
      fontWeight: '900',
      marginTop: 80,
      marginBottom: 20,
    },
    smallTexts:{
      fontWeight: 'bold',
      color: '#000000',
      textAlign: 'center',
      marginTop: 30,
      marginRight: 300,
    },
    smallTexts1:{
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
      marginTop: 15,
      textAlign: 'center'
    },
    buttonTexts:{
      color: '#000000',
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 15
    },
    input: {
      borderColor: '#000000',
      height: 60,
      borderWidth: 1,
      marginTop: 10,
      paddingLeft: 10,
      borderRadius: 30,
      width: '90%',
      backgroundColor: '#d9d9d9',
    },
    icon:{
      marginBottom: 60,
    },
    button:{
      width: 180,
      height: 50,
      marginTop: 60,
      backgroundColor: '#000000',
      borderRadius: 7,
    },
    button1:{
      width: 100,
      height: 50,
      marginTop: 10,
      marginLeft: 0,
      backgroundColor: '#d9d9d9',
      borderRadius: 15,
    },
    availability:{
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
    },
})    