import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Platform,TextInput, Text, TouchableOpacity, FlatList } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function SearchPage( {route} ) {
    const [searchQuery, setSearchQuery] = useState('');
    const [tutors, setTutor] = useState([]);
    const [searchAttempted, setSearchAttempted] = useState(false);
    const navigation = useNavigation();
    const { searchQuery: initialSearchQuery } = route.params || {};

    const searchTutor = async () => {
        if (!searchQuery.trim()) {
            alert("Please enter a valid search term.");
            setTutor([]); // Clear results if search query is empty
            return;
        }
        try {
            const res = await axios.get(`http://172.20.10.6:5001/search?expertise=${encodeURIComponent(searchQuery)}`);
            setTutor(res.data.data);
            setSearchAttempted(true);
        } catch (error) {
            console.error('Error finding tutors', error);
            alert('Error finding tutors')
        }
    }

    const handleSubmit = () => {
        setSearchAttempted(true); // Mark that the search is attempted
        searchTutor();
    };

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setTutor([]);  // Clear results when search is empty
            return;
        }

        const delayDebounce = setTimeout(() => {
            searchTutor();
        }, 500);  // Adjust delay time if needed (500ms is a good default)

        // Cleanup function to clear timeout if searchQuery changes before the delay
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    // Update search query if initialSearchQuery is provided (for example, from navigation)
    useEffect(() => {
        if (initialSearchQuery && initialSearchQuery.trim() !== '') {
            setSearchQuery(initialSearchQuery);
        }
    }, [initialSearchQuery]);

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
            onSubmitEditing={handleSubmit}
            />
        </View>
        {/* Show no tutors message when there are no results and searchQuery is not empty */}
        {tutors.length === 0 && searchQuery.trim() !== '' && (
                <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
                    No tutors found for "{searchQuery}"
                </Text>
            )}
        <FlatList
        data={tutors}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({item}) => (
            <TouchableOpacity onPress={() => navigation.navigate('TutorDetailScreen', {tutor: item})} style={styles.tutorCard}>
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
        marginTop: Platform.OS === 'android' ? -40 : undefined
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
        marginBottom: 20,
        paddingLeft: 40,
        borderRadius: 30,
        width: '90%',
        backgroundColor: '#d9d9d9',
      },
      icon1:{
        position: 'absolute',
        top: '52%',
        left: 18,
        transform: [{ translateY: -12 }],
        zIndex: 1
      },
      tutorCard:{
        width: 188,
        height: 162,
        backgroundColor: '#d9d9d9',
        borderRadius: 45,
        paddingLeft: 20,
        justifyContent: 'center',
        margin: 10,
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