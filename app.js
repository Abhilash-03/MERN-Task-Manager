require('dotenv').config();
require('express-async-errors');
const express = require('express');
const connectDB = require('./db/connectDB');
const mainRouters = require('./routes/todoRoute');
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const genaiRouter = require('./routes/genaiRoute');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const authenticated = require('./middlewares/authentication');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

const options = {
  origin: 'https://todolist-views.vercel.app',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true 
}

// Middlewares
app.use(cors(options)); // in production
// app.use(cors({origin: 'http://localhost:3000', credentials: true})); // in development
app.use(express.json());
app.use(cookieParser())


app.get('/', (req, res) => {
    res.send("<h1>Todo List App</h1>");
})

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v2/todos', authenticated, mainRouters);
app.use('/api/v1/ai', authenticated, genaiRouter);

app.use(notFound);
app.use(errorHandler);

const start = async()=>{
    try{
        connectDB(process.env.MONGO_URI);
        app.listen(PORT, ()=> console.log(`Server listening on port ${PORT}...`));
    }
     catch(err){
        console.log(err);
     }
}
start();