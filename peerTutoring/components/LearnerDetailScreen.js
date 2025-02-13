import { useNavigation } from '@react-navigation/native'
import React from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Platform, TouchableOpacity, View, Text, SafeAreaView } from 'react-native'

export default function LearnerDetailScreen({ route }) {
    const { tutor, userName, userEmail } = route.params;
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Entypo name="chevron-left" size={50} color="black" style={styles.icon}/>
            </TouchableOpacity>
            <Text style={styles.title}>Profile</Text>
        </View>
        <FontAwesome
        name='user-circle-o'
        size={100}
        />
        <Text style={styles.text1}>{tutor.fname}</Text>
        <Text style={styles.texts}>Level: {tutor.level}</Text>
        <Text style={styles.texts}>Course: {tutor.course}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ChatScreen',{sender: userEmail, receiver: tutor.email, userName: tutor.fname})} style={styles.button}>
            <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
    },
    header:{
        flexDirection: 'row',
        marginRight: 180,
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
        color: 'black',
        fontSize: 30,
        marginTop: 10,
        marginBottom: 80
    },
    texts:{
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 50
    },
    button:{
        width: 120,
        height: 50,
        marginTop: Platform.OS === 'ios' ? 200 : 150,
        marginLeft: 250,
        backgroundColor: '#000000',
        borderRadius: 7,
        padding: 15,
    },
    buttonText:{
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
})