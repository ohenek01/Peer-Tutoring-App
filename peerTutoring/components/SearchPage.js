import React, { useState } from 'react'
import { View, StyleSheet, TextInput, Text, TouchableOpacity, FlatList } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [tutors, setTutor] = useState([]);
    const navigation = useNavigation();

    const searchTutor = async() => {
        try {
            const res = await axios.get(`http://172.20.10.6:5001/search?expertise=${searchQuery}`);
            setTutor(res.data.data)
        } catch (error) {
            console.error('Error finding tutors', error);
        }
    }
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
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchTutor}
            />
        </View>
        <FlatList
        data={tutors}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({item}) => (
            <TouchableOpacity style={styles.tutorCard}>
                <FontAwesome name='user-circle-o' style={styles.icon2} size={24}/>
                <Text style={styles.text1}>{item.fname}</Text>
                <Text>{item.level}</Text>
                <Text>{item.expertise}</Text>
            </TouchableOpacity>
        )}
        />
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
      tutorCard:{
        flex: 1,
        width: 188,
        height: 162,
        backgroundColor: '#d9d9d9',
        borderRadius: 45,
        paddingLeft: 20,
        justifyContent: 'center',
        margin: 10
    },
    text1:{
        fontWeight: 'bold',
        textAlign: 'center'
    },
    icon2:{
        position: 'absolute',
        top: 20,
        left: 100
    },
    
})