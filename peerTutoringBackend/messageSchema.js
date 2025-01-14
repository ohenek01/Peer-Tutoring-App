const { mongoose, collection } = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {type: String, required: true},
    receiver: {type: String, required: true},
    message: {type: String, required: true}
},{
    collection: 'Message',
    timeStamp: true,
});
mongoose.model('Message', messageSchema);