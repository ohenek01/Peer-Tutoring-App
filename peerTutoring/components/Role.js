import React, { useState } from 'react'
import { View, StyleSheet, Text, StatusBar, TouchableOpacity, Alert } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';

export default function Role() {
    const [role, setRole] = useState('');

    const handleSubmit = () => {
      if(!role){
        Alert.alert('Error', 'Please select a role');
        return;
      }
      const Roles = {role};

      axios.post('http://localhost:5001/register', Roles)
      .then(res => {
        if(res.data.status === 'Ok'){
          Alert.alert('Success', 'Role selected Successfully')
          //navigation
        }else{
          Alert.alert('Error', res.data.data || 'Failed to register role');
        }
      })
      .catch(error =>{
        console.error(error);
        Alert.alert('Error', 'Somethimg went wrong')
      });
    }
  return (
    <View style={styles.container}>
      <Text style={styles.texts}>What is your Role?</Text>
      <Text style={styles.text1}>I want to be:</Text>
      <TouchableOpacity style={styles.button} onPress={() => setRole('Tutor')}>
        <Text style={styles.smallTexts1}>Tutor</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button1} onPress={() => setRole('Learner')}>
        <Text style={styles.smallTexts}>Learner</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button2} onPress={handleSubmit}>
        <Text style={styles.smallTexts}>Next</Text>
        <AntDesign name="arrowright" size={24} color="#ffffff" style={styles.icon}/>
      </TouchableOpacity>
      <StatusBar barStyle="dark-content" />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff'
  },
  texts:{
    color: '000000',
    fontSize: 40,
    fontWeight: '900',
    marginTop: 150,
    marginLeft: 30
  },
  text1:{
    fontWeight: '800',
    fontSize: 30,
    margin: 50
  },
  button:{
    width: 150,
    height: 50,
    marginTop: 60,
    marginLeft: 130,
    backgroundColor: '#d9d9d9',
    borderRadius: 7,
  },
  button1:{
    width: 150,
    height: 50,
    marginTop: 60,
    marginLeft: 130,
    backgroundColor: '#000000',
    borderRadius: 7,
  },
  smallTexts:{
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 18
  },
  smallTexts1:{
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginTop: 18
  },
  icon:{
    position: 'absolute',
    top: 15,
    left: 120
  },
  button2:{
    width: 150,
    height: 50,
    marginTop: 200,
    marginLeft: 250,
    backgroundColor: '#000000',
    borderRadius: 7,
  },
})