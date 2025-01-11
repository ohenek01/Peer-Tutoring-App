const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(express.json());

//Database Connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDb Connected"))
.catch(() => console.log("MongoDb not connected"))

//calling the schema
require('./schema')
const User = mongoose.model("userInfo");

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

app.get('/tutors', async(req, res) => {
    
    try {
        const tutors = await User.find({role: /tutor/i }).lean()
        res.status(201).send({status: 'Ok', data: tutors})
    } catch (error) {
        console.error(error);
        res.status(500).send({status: 'Error', data: 'Server Error'})
    }
})

app.listen(5001, () => {
    console.log("Server has Started")
})