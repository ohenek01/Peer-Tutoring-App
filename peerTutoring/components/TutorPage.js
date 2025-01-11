import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, Text, FlatList } from 'react-native';
import axios from 'axios';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

export default function TutorPage() {
    const [tutor, setTutor] = useState([]);
    const navigation = useNavigation();

    const fetchTutors = async() => {
        try {
            const res = await axios.get('http://172.20.10.6:5001/tutors');
            setTutor(res.data.data)
        } catch (error) {
            console.error('Error fetching Tutors', error)
        }
    }

    useEffect(() => {
        fetchTutors();
    },[])
  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Entypo name="chevron-left" size={50} color="black" style={styles.icon}/>
            </TouchableOpacity>
            <Text style={styles.title}>Tutors</Text>
        </View>
        <FlatList
        data={tutor}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({item}) => (
            <TouchableOpacity style={styles.tutorCard}>
                <FontAwesome name='user-circle-o' style={styles.icon1} size={24}/>
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
    header:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        color: 'black',
        fontWeight: '900',
        textAlign: 'center',
        marginTop: 80,
        marginBottom: 10,
        marginLeft: 100,
    },
    icon:{
        marginTop: 70
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
    icon1:{
        position: 'absolute',
        top: 20,
        left: 100
      },
})