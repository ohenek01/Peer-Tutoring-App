const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Pusher = require('pusher');
require('dotenv').config();

//calling the schema
require('./schema')
const User = mongoose.model("userInfo");

//calling message Schema
require('./messageSchema')
const Message = mongoose.model('Message')


app.use(express.json());

//pusher secret keys
const pusher = new Pusher({
    appId: process.env.app_id,
    key: process.env.key,
    secret: process.env.secret,
    cluster: process.env.cluster,
    useTLS: true,
})

 //Database Connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDb Connected"))
.catch(() => console.log("MongoDb not connected"))

//server started
app.get('/', (req, res) => {
    res.send({status: "Started"})
})

//register user
app.post('/register', async(req, res) => {
    const { fname, lname, email, password, role, } = req.body;
    console.log('Received payload:', req.body);

    //validate input
    if(!fname|| !lname|| !email|| !password){
        return res.status(400).send({status: "Error", data: "All fields are required"})
    }

    try {
    //check if user exists
    const userExists = await User.findOne({email: email})
    if(userExists){
        return res.status(400).send({status:"Error", data: "Email taken"})
    }

    //password encryption
    const encryptedPassword = await bcrypt.hash(password, 10);  

    //add user to the database
        await User.create({
            fname: fname,
            lname: lname,
            email: email,
            password: encryptedPassword,
            role, 
        });

        return res.send({status: "Ok", data: "User created"})
    } catch (error) {
        console.error(error)
        res.status(500).send({status: "Error", data: error.message})
    }
})   

//login user
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    //validate input
    if(!email || !password){
        return res.status(400).send({status: "Error", data: "All fields are Required"})
    }

    try {
        //check if email and password valid
        const userExists = await User.findOne({email: email})
        if(!userExists){
            return res.status(400).send({status: "Error", data: "Invalid Email"})
        }
        const isPasswordValid = await bcrypt.compare(password, userExists.password)
        if(!isPasswordValid) return res.status(400).send({status: "Error", data: "Invalid Password"})

        const token = jwt.sign({email: userExists.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
        if(res.status(200)){
            return res.send({status: 'Ok', data: {token:token, role:userExists.role}})}
    } catch (error) {
        res.status(500).send('Error Logging In')
    }
})

//update profile
app.put('/profile', async (req, res) => {
    const { email, level, course, expertise, availability} = req.body;

    try {
        const updateUser = await User.findOneAndUpdate(
            {email},
            { level, course, expertise, availability},
            {new: true}
        );
        
        if(!updateUser){
            return res.status(404).send({ status: "Error", data: "User not found" });
        }
        res.status(200).send({status: 'Ok', data: updateUser})
    } catch (error) {
        res.status(500).send({status: "Error", data: "Error updating profile"})
    }
});

//fetch user details
app.get('/profile', async(req,res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if(!token){
        return res.status(401).send({status: 'Error' ,data: 'Authorization token required'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({email: decoded.email}).select('-password');
        if(!user){
            return res.status(404).send({status: 'Error', data: 'User not found'});
        }
        return res.status(201).send({status: 'Ok', data: user})
    } catch (error) {
        if(error.name === 'JsonWebTokenError'){
            return res.status(401).send({status: 'Error', data: 'Invalid Token'})
        }
        if(error.name === 'TokenExpiredError'){
            return res.status(401).send({status: 'Error', data: 'Token Expired'})
        }
        res.status(500).send({status: 'Error', data: 'Error fetching details'})
    }
})

// fetch tutor details
app.get('/tutors', async(req, res) => {
    
    try {
        const tutors = await User.find({role: /tutor/i }).lean()
        res.status(201).send({status: 'Ok', data: tutors})
    } catch (error) {
        console.error(error);
        res.status(500).send({status: 'Error', data: 'Server Error'})
    }
})

//fetch learner details
app.get('/learners', async (req, res) => {
    try {
        const learners = await User.find({role: /learner/i}).lean()
        res.status(201).send({status: 'Ok', data: learners})
    } catch (error) {
        console.error(error);
        res.status(500).send({status: 'Error', data: 'Server Error'})
    }
})

// search functionality
app.get('/search', async(req, res) => {
    const { expertise } = req.query;
    if(!expertise){
        return res.status(400).send({status: 'Error', data: 'Expertise is required'})
    }
    try {
        const tutors = await User.find({expertise: {$regex: expertise, $options: 'i'}});
        if(tutors.length === 0){
            return res.status(404).send({status: 'Error', data: 'No tutors found for this subject'})
        }
        res.status(201).send({status: 'Ok', data: tutors});
    } catch (error) {
        console.error(error)
        res.status(500).send({status: 'Error', data: 'Server Error'})
    }
})

// send a message
app.post('/message', async(req, res) => {
    const { sender, receiver, message } = req.body;

    try{
    const newMessage = await Message.create({
        sender, message, receiver
    })
    pusher.trigger(`private-chat-${sender}-${receiver}`, 'new-message',{
        sender: sender,
        receiver: receiver,
        message: message
    });
    res.send({status: 'Message sent', data: newMessage})
}catch(error){
    console.error('Error sending message:', error)
    res.status(500).send({ status: 'Error', data: 'Failed to send message' })
}
});

app.get('/message', async (req, res) => {
    const { sender, receiver } = req.query;
    try {
        const message = await Message.find({
            $or:[
                { sender, receiver },
                { sender: sender, receiver: receiver, }
            ],
        }).sort({ timeStamp: 1 })
    } catch (error) {
        console.error('Error fetching messages:', error)
        res.status(500).send({status: 'Error', data: 'Failed to fetch messages'})
    }
})

app.listen(5001, () => {
    console.log("Server has Started")
})