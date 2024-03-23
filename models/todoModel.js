const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxlength: [40, 'Max. length should be 40 characters']
    },
    completed: {
        type: Boolean,
        default: false
    },
    favourite: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    }

},{timestamps: true})

module.exports = mongoose.model('Todo', todoSchema)