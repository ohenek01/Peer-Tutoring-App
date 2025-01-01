const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(express.json())
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

app.listen(5001, () => {
    console.log("Server has Started")
})