const mongoose = require('mongoose');

const connectDB = (url)=>{
    mongoose.connect(url)
    .then(() => console.log('Mongodb connected!!'))
    .catch((err) => console.log(err.message));
}


module.exports = connectDB