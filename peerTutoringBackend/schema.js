const { mongoose, Collection } = require('mongoose');

const schema = new mongoose.Schema({
    fname:{ type: String, required: true, },
    lname:{ type: String, required: true, },
    email:{ type: String, required: true, lowercase: true},
    password:{ type: String, required: true },
    role: {type: String, enum: ['Tutor', 'Learner'], },
    level: {type: String},
    course: {type: String},
    expertise: {type: String},
    availability: { type: [String] },
},{
    collection: "userInfo",
    timestamps: true
});
mongoose.model("userInfo", schema);