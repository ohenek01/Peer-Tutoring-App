import React, { useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, StyleSheet, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function Profile({ route }) {
  const {fname, lname, email} = route.params;
  const [level, setLevel] = useState('');
  const [course, setCourse] = useState('');

  const handleSubmit = () => {
    if(!level || !course){
      alert('Level and Course fields are required');
      return;
    }

    const userData = {fname, lname, email, level, course};

    axios.put('http://localhost:5001/profile', userData)
    .then(res => {
      if(res.data.status === 'Ok'){
        Alert.alert('Successful', 'Welcome!')
        //navigation
      }
    })
    .catch(error => {
      console.error(error)
      Alert.alert('Error', 'Something went wrong')
    })
  }
  return (
    <View style={styles.container}>
        <Text style={styles.texts}>Profile</Text>
        <FontAwesome style={styles.icon}name="user-circle-o" size={100} color="black" />
        <Text style={styles.smallTexts}>Name:</Text>
        <TextInput style={styles.input}
          value={`${fname} ${lname}`}
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
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.smallTexts1}>Save and Continue</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
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
})    