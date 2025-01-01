import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function Welcome() {
    const navigate = useNavigation();

    const handleSubmit = () => {navigate.replace('SignUp')}
  return (
    <View style={styles.container}>
        <Text style={styles.texts}>Welcome!</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.smallTexts}>Get Started</Text>
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
        color: '000000',
        fontSize: 50,
        fontWeight: 'bold',
    },
    smallTexts:{
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginTop: 18
    },
    button:{
        width: 150,
        height: 60,
        marginTop: 60,
        backgroundColor: '#000000',
        borderRadius: 7
    }
  });