const { mongoose, Collection } = require('mongoose');

const schema = new mongoose.Schema({
    name:{ type: String, required: true, trim: true },
    email:{ type: String, required: true, lowercase: true},
    password:{ type: String, required: true }
},{
    collection: "userInfo",
    timestamps: true
});
mongoose.model("userInfo", schema);