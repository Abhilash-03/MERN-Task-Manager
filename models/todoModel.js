const mongoose = require('mongoose');

const todoScheme = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxlength: [40, 'Max. length should be 40 characters']
    },

    completed: {
        type: Boolean,
        default: false
    }
},{timestamps: true})

module.exports = mongoose.model('Todo', todoScheme)