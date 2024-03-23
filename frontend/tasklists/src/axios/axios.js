import axios from "axios";

export default axios.create({
    baseURL: 'https://todo-lists-api.vercel.app',
    withCredentials: true
  
})