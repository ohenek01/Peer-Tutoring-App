import React from 'react'
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

export default function SearchPage() {
    const navigation = useNavigation()
  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Entypo name="chevron-left" size={50} color="black" style={styles.icon}/>
            </TouchableOpacity>
            <Text style={styles.title}>Search</Text>
        </View>
    <View style={styles.inputContainer}>
      <FontAwesome
      name='search'
      size={20}
      color={'gray'}
      style={styles.icon1}
      />
      <TextInput 
      style={styles.input}
      placeholder='Search...'
      />
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 30,
        color: 'black',
        fontWeight: '900',
        textAlign: 'center',
        marginTop: 80,
        marginBottom: 10,
        marginLeft: 40,
    },
    header:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon:{
        marginTop: 70
    },
    inputContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginLeft: 20
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
      icon1:{
        position: 'absolute',
        top: '62%',
        left: 18,
        transform: [{ translateY: -10 }],
        zIndex: 1
      },
})