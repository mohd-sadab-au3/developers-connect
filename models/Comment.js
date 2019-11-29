const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'post'
    },
    text: {
        type: String,
        required: true,
    },
    likes: {
        type: Array
    },
    date: {
        type: Date,
        default: Date.now
    },

    reply: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: 'comment'
        }, text: {
            type: String,
            required: true,
        },
        likes: {
            type: Array
        },
        date: {
            type: Date,
            default: Date.now
        },
    }]


})

module.exports = mongoose.model('comment', CommentSchema);