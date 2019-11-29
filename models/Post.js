const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Array
    }

})

module.exports = mongoose.model('post', Post);