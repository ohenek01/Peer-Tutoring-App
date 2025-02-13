import React, {useEffect, useState} from 'react'
import { View, ActivityIndicator, FlatList, TouchableOpacity, Text } from 'react-native'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ChatPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const fetchChattedUsers = async(token) => {
        try {
            const res = await axios.get('http://172.20.10.6:5001/chatted-users',{
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('API Response:', res.data);  // Log full response
            
            return res.data.data || [];
        } catch (error) {
            console.error('Error fetching chat users:', error);
            return[];
        }
    }

    useEffect(() => {
        const getUsers = async () => {
            const token = await AsyncStorage.getItem('userToken');
            console.log("Token:", token); 

            if(token){
                const fetchUsers = await fetchChattedUsers(token);
                console.log("Fetched Users:", fetchUsers);

                setUsers(fetchUsers);
            }
            setLoading(false);
        };
        getUsers();
    }, []);

    const openChat = async (user) => {
        try{
        const sender = await AsyncStorage.getItem('userEmail')
        if(!sender){
            console.error('Sender email not in storage');
            return;
        }
        navigation.navigate('ChatScreen', {sender, receiver: user.email, userName: user.name})
        }catch{}
    };

    if(loading){
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }
return(
 <View style={{ flex: 1, padding: 20 }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Chats</Text>
        <FlatList
            data={users}
            keyExtractor={(item) => item.userId}
            renderItem={({ item }) => (
            <TouchableOpacity 
                onPress={() => openChat(item)} 
                style={{ padding: 15, borderBottomWidth: 1, borderColor: '#ccc' }}
                >
                <Text style={{ fontSize: 18 }}>{item.name}</Text>
                <Text style={{ fontSize: 14, color: 'gray' }}>{item.email}</Text>
            </TouchableOpacity>
                )}
            />
        </View>
        )
};

