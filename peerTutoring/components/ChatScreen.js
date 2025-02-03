import React, { useEffect, useRef, useState } from 'react'
import { Text, View, StyleSheet, FlatList, TextInput, TouchableOpacity, Platform, StatusBar } from 'react-native'
import Pusher from 'pusher-js'
import axios from 'axios';
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function ChatScreen  ({route}){
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const {sender, receiver, userName} = route.params;
    const navigation = useNavigation();

    console.log('Sender in ChatScreen:', sender);
    console.log('Receiver in ChatScreen:', receiver);
    console.log('UserName in ChatScreen:', userName);

    const channelRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if(!sender || !receiver){
                    console.error('Sender or Receiver is missing');
                    return;
                }
                console.log('Fetching messages for:', { sender, receiver });
                const res = await axios.get('http://172.20.10.6:5001/message',{
                    params: { sender, receiver }
                });
                if(res.data && res.data.data && res.data.data.length > 0){
                setMessages(res.data.data)
            }else{
                setMessages([]);
            }
            } catch (error) {
                console.error('Error fetching messages:', error.response ? error.response.data : error.message);
                setMessages([]); 
            }
        };
        fetchMessages();

    try{   
        const pusher = new Pusher('61b2bc1b9e24dce99794',{
            cluster: 'mt1'
        });

        const channel = `private-chat-${sender}-${receiver}`;

        channelRef.current = pusher.subscribe(channel);
        channelRef.current.bind('new-message', (data) => {
            console.log('New message received:', data);
            // Ensure the data has the correct structure
            if (data && data.sender && data.message) {
                setMessages((prevMessages) => [...prevMessages, { sender: data.sender, message: data.message }]);
            } else {
                console.error('Received message data is not in the expected format:', data);
            }
        });
    }catch(error){
        console.error('Error with pusher subscription', error)
    }
        
        return () => {
            if(channelRef.current){
                channelRef.current.unbind_all();
                channelRef.current.unsubscribe(channelRef);
            }
        };
    }, [sender, receiver]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return; // Prevent sending empty messages
        const token = AsyncStorage.getItem('userToken')

        const message = { sender, receiver, message: newMessage };
        try {
            console.log('Sending message:', message)
            await axios.post('http://172.20.10.6:5001/message',{
                sender: sender,
                receiver: receiver,
                message: newMessage,
            },{
                headers: { 'Content-Type': 'application/json' },
            });
            setMessages((prevMessages) => [...prevMessages, message]);
            setNewMessage('')
        } catch (error) {
            console.error('Error fetching messages:', error.response ? error.response.data : error.message);
        }
    }

    return (
      <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Entypo name="chevron-left" size={50} color="black" style={styles.icon}/> {/* Back button */}
                </TouchableOpacity>
                <Text style={styles.receiverName}>{userName}</Text>
            </View>
            <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={<Text>Start a conversation!</Text>}
            renderItem={({item}) => {
                const isSender = item.sender.email === sender;
                console.log('Message sender:', item.sender.email);
                console.log('Current user (sender):', sender);
                console.log('Is sender:', isSender);
                return(
                <View style={[styles.messageContainer, isSender ? styles.senderContainer : styles.receiverContainer]}>
                <View style={[styles.message, isSender ? styles.senderMessage : styles.receiverMessage]}>
                    <Text style={styles.messageText}>{item.sender.fname}: {item.message}</Text>
                </View>
                </View>
            )}}
            />
            <View style={styles.inputContainer}>
                <TextInput
                style={styles.input}
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder='Type your message...'
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
            <StatusBar barStyle="dark-content" />
      </View>
    )
  }

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#d9d9d9', // Light gray background for the header
        borderBottomWidth: 1,
        borderBottomColor: '#d9d9d9',
        marginTop: Platform.OS === 'ios' ? 55 : undefined
    },
    receiverName:{
        marginLeft: 140,
        fontWeight: 'bold',
        fontSize: 25
    },
    senderMessage:{
        backgroundColor: '#808080'
    },
    receiverMessage:{
        backgroundColor: '#d9d9d9'
    },
    senderContainer:{
        justifyContent: 'flex-end',
    },
    receiverContainer:{
        justifyContent: 'flex-start',
    },
    inputContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        width: '90%',
        marginLeft: 20
    },
    messageContainer:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: 5
    },
    message:{
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        maxWidth: '80%',
    },
    messageText:{
        width: 200
    },
    input:{
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    sendButton:{
        marginLeft: 20,
        backgroundColor: '#d9d9d9',
        padding: 10,
        borderRadius: 5,
    },
    sendButtonText:{
        color: '#000000'
    }
})

