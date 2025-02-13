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
    let { expertise } = req.query;
    if(!expertise || expertise.trim() === ''){
        return res.status(400).send({status: 'Error', data: 'Expertise is required'})
    }
    expertise = expertise.trim();
    const words = expertise.split(" ");
    const regexQueries = words.map(word => ({ expertise: { $regex: word, $options: 'i' } }));
    try {
        const tutors = await User.find({ $or: regexQueries });
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
        const senderUser = await User.findOne({email: sender});
        const receiverUser = await User.findOne({email: receiver});
        if(!senderUser || !receiverUser){
            return res.status(404).send({status: 'Error', data: 'User not found'})
        }

        const existingMessage = await Message.findOne({
            $or: [
                { sender: senderUser._id, receiver: receiverUser._id },
                { sender: receiverUser._id, receiver: senderUser._id }
            ]
        });

        const newMessage = await Message.create({
        sender: senderUser._id, 
        receiver: receiverUser._id, 
        message
        });
        console.log('New message created:', newMessage);
        console.log('Broadcasting new message:', {
            sender: senderUser ._id,
            receiver: receiverUser ._id,
            message,
        });
        
        pusher.trigger(`private-chat-${senderUser._id}-${receiverUser._id}`, 'new-message',{
            sender: senderUser._id,
            receiver: receiverUser._id,
            message,
        });
        res.send({status: 'Message sent', data: newMessage})
    }catch(error){
    console.error('Error sending message:', error)
    res.status(500).send({ status: 'Error', data: 'Failed to send message' })
}
});

app.get('/message', async (req, res) => {
    console.log('Received request for messages:', req.query);
    const { sender, receiver } = req.query;
    try {
        console.log('Sender:', sender); 
        console.log('Receiver:', receiver);

        const senderUser = await User.findOne({email: sender});
        console.log('Sender User:', senderUser );
        
        const receiverUser = await User.findOne({email: receiver});
        console.log('Receiver User:', receiverUser ); 

        if(!senderUser || !receiverUser){
            return res.status(404).send({status: 'Error', data: 'User not found'})
        }

        const message = await Message.find({
            $or:[
                { sender:senderUser._id, receiver:receiverUser._id },
                { sender: receiverUser._id, receiver: senderUser._id, }
            ],
        }).sort({ timeStamp: 1 })
        .populate('sender', 'fname lname email')
        .populate('receiver', 'fname lname email');

        if(message.length === 0){
            return res.status(200).send({status: 'OK', data: []});
        }

        res.status(200).send({status: 'OK', data: message})
    } catch (error) {
        console.error('Error fetching messages:', error)
        res.status(500).send({status: 'Error', data: 'Failed to fetch messages'})
    }
})

app.get('/chatted-users', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).send({ status: 'Error', data: 'Authorization token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).send({ status: 'Error', data: 'User not found' });
        }

        // Find distinct users the current user has chatted with
        const chattedUsers = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: user._id }, { receiver: user._id }]
                }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$sender", user._id] },
                            "$receiver",
                            "$sender"
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: "userInfo",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    _id: 0,
                    userId: "$user._id",
                    name: { $concat: ["$user.fname", " ", "$user.lname"] },
                    email: "$user.email"
                }
            }
        ]);

        res.status(200).send({ status: 'Ok', data: chattedUsers });
    } catch (error) {
        console.error('Error fetching chatted users:', error);
        res.status(500).send({ status: 'Error', data: 'Failed to fetch chatted users' });
    }
});



app.listen(5001, () => {
    console.log("Server has Started")
})