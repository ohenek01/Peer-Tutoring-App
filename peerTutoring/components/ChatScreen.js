import React, { Component, useEffect, useState } from 'react'
import { Text, View, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native'
import Pusher from 'pusher-js'
import axios from 'axios';

export default function ChatScreen  ({route}){
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const {sender, receiver} = route.params;

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get('http://172.20.10.6:5001/message',{
                    params: { sender, receiver }
                });
                setMessages(res.data.data)
            } catch (error) {
                console.error('Error fetching messages', error)
            }
        };
        fetchMessages();
        
        const pusher = new Pusher("61b2bc1b9e24dce99794",{
            cluster: 'mt1'
        });

        const channel = pusher.subscribe(`private-chat-${sender}-${receiver}`);
        channel.bind('new-message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });
        
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    const sendMessage = async () => {
        if (!newMessage.trim()) return; // Prevent sending empty messages

        const message = { sender, receiver, message: newMessage };
        try {
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
            console.error('Error sending message:', error)
        }
    }

    return (
      <View style={styles.container}>
            <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
                <View style={styles.message}>
                    <Text>{item.sender}: {item.message}</Text>
                </View>
            )}
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
      </View>
    )
  }

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    inputContainer:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    message:{
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5
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

