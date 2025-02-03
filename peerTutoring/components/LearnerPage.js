import React, { useEffect, useState } from 'react'
import { StyleSheet, Platform, TouchableOpacity, View, Text, FlatList } from 'react-native';
import axios from 'axios';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LearnerPage() {
    const [userData, setUserData] = useState(null);
    const [learner, setLearner] = useState([]);
    const navigation = useNavigation();

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

      const fetchLearners = async () => {
        try {
            const res = await axios.get('http://172.20.10.6:5001/learners');
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
    },[])
  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Entypo name="chevron-left" size={50} color="black" style={styles.icon}/>
            </TouchableOpacity>
            <Text style={styles.title}>Learners</Text>
        </View>
        <FlatList
        data={learner}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({item}) => (
            <TouchableOpacity onPress={() => navigation.navigate('TutorDetailScreen', {tutor: item, userName: userData.fname, userEmail: userData.email})} style={styles.tutorCard}>
                <FontAwesome name='user-circle-o' style={styles.icon1} size={24}/>
                <Text style={styles.text1}>{item.fname}</Text>
                <Text>{item.level}</Text>
                <Text>{item.course}</Text>
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
        marginTop: Platform.OS === 'android' ? -40 : undefined
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