const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxlength: [40, 'You can only write upto 40 characters']
    },
    notes: {
        type: String,
        maxlength: [150, 'You can only write upto 150 characters'],
    },
    status: {
        type: String,
        default: 'pending'
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