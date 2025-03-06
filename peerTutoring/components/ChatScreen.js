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

    const channelRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (!sender || !receiver) return;
                
                const res = await axios.get('http://192.168.0.102:5001/message', {
                    params: { sender, receiver }
                });

                if (res.data && res.data.data) {
                    const formattedMessages = res.data.data
                        .map((msg) => ({
                            ...msg,
                            senderEmail: msg.sender.email,
                            createdAt: new Date(msg.createdAt)
                        }))
                        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
                    
                    setMessages(formattedMessages);
                } else {
                    setMessages([]);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
                setMessages([]);
            }
        };

        // Fetch messages immediately and set up interval
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);

        return () => {
            clearInterval(interval);
            if (channelRef.current) {
                channelRef.current.unsubscribe();
            }
        };
    }, [sender, receiver]);

    useEffect(() => {
        const pusher = new Pusher('61b2bc1b9e24dce99794', {
            cluster: 'mt1'
        });

        const channel = `private-chat-${sender}-${receiver}`;
        channelRef.current = pusher.subscribe(channel);

        channelRef.current.bind('new-message', (data) => {
            if (data && data.sender && data.message) {
                const newMsg = {
                    sender: data.sender,
                    receiver: receiver,
                    message: data.message,
                    senderEmail: data.sender.email || '',
                    createdAt: new Date()
                };
                
                setMessages(prev => {
                    const updatedMessages = [...prev, newMsg];
                    updatedMessages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
                    return updatedMessages;
                });
            }
        });

        return () => {
            if (channelRef.current) {
                channelRef.current.unbind_all();
                channelRef.current.unsubscribe();
            }
        };
    }, [sender, receiver]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        
        try {
            const res = await axios.post('http://192.168.0.102:5001/message', {
                sender: sender,
                receiver: receiver,
                message: newMessage,
            });

            if (res.data) {
                const message = {
                    sender: sender,
                    receiver: receiver,
                    message: newMessage,
                    senderEmail: sender.email,
                    createdAt: new Date()
                };
                
                setMessages(prev => {
                    const updatedMessages = [...prev, message];
                    updatedMessages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
                    return updatedMessages;
                });
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

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
                return(
                <View style={[styles.messageContainer, isSender ? styles.senderContainer : styles.receiverContainer]}>
                <View style={[styles.message, isSender ? styles.senderMessage : styles.receiverMessage]}>
                    <Text style={styles.messageText}> {item.sender.email}:{item.message}</Text>
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
        marginLeft: 120,
        fontWeight: 'bold',
        fontSize: 25
    },
    senderMessage:{
        backgroundColor: '#808080'
    },
    receiverMessage:{
        backgroundColor: '#d9d9d9'
    },
    senderContainer: {
        alignSelf: 'flex-end', // Align sender's message to the right
    },
    receiverContainer: {
        alignSelf: 'flex-start', // Align receiver's message to the left
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
        maxHeight: '100%'
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

