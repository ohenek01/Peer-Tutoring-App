import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, StatusBar, Button, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const navigate = useNavigation();

    const handleSubmit = () => {
        const userData = {
            fname: fname,
            lname: lname,
            email,
            password,
        };
        axios.post("http://localhost:5001/register", userData)
        .then(res => {
            console.log(res.data);
            if(res.data.status === "ok"){
                alert("Sign Up successful")
                navigate.replace('Login', {fname});
            }else{
                console.log("Error:", res.data.data || "Unexpected response");
                alert(res.data.data || "Registration failed");
            }
        })
        .catch(e => {
            console.log("Error:", e.message);
            alert("Email already exists. Please try again!");
        })
        
    };

    return (
        <View style={styles.formContainer}>
                <Text style={styles.title}>Sign Up</Text>
                <View style={styles.input2}>
                <TextInput
                    style={styles.input1}
                    placeholder="First Name"
                    value={fname}
                    onChangeText={setFname}
                />
                <TextInput
                    style={styles.input1}
                    placeholder="Last Name"
                    value={lname}
                    onChangeText={setLname}
                />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="kbs12@st.ug.edu.gh"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password..."
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.smallTexts}>Sign Up</Text>
                </TouchableOpacity>
                <StatusBar barStyle="dark-content" />
        </View>           
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backgroundImage:{
        marginTop: 50,
        height: 900
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        marginBottom: 20
    },
    input: {
        borderColor: '#000000',
        height: 60,
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 9,
        width: '100%',
        backgroundColor: '#d9d9d9',
    },
    input1:{
        borderColor: '#0000000',
        height: 60,
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 9,
        width: '48%',
        backgroundColor: '#d9d9d9',
    },
    input2:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 50,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 50
    },
    smallTexts:{
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginTop: 18
    },
    button:{
        width: 120,
        height: 50,
        marginTop: 60,
        marginLeft: 130,
        backgroundColor: '#000000',
        borderRadius: 7,
    },
    forgotPassword: {
        color: 'black',
        marginBottom: 20,
        marginLeft: 250,
    },
});