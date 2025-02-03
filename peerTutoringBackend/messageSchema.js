const { mongoose, collection } = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userInfo', 
        required: true,

    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    },
    message: {type: String, required: true}
},{
    collection: 'Message',
    timeStamp: true,
});
mongoose.model('Message', messageSchema);