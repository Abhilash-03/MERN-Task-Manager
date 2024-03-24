import axios from "axios";

export default axios.create({
    baseURL: 'https://todo-lists-api.vercel.app', // in production
    // baseURL: 'http://localhost:5000', // in development
    withCredentials: true
  
})