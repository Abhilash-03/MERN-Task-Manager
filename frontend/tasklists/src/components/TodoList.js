import React, { useEffect } from 'react'
import { MdReadMore } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import api from '../axios/axios'
import { useDispatch, useSelector } from 'react-redux';
import { getTodoFailure, getTodos } from '../redux/todo/todoSlice';

const TodoList = () => {
  const dispatch = useDispatch();
  const { lists } = useSelector(state => state.todo);
  const {currentUser} = useSelector(state => state.user);
  const navigate = useNavigate();
  
  useEffect(() => {
    const getAllItems = async() => {
      setTimeout(() => {
        if(currentUser === null) {
          navigate('/login')
        }
      }, 1000)
      try {
        const res = await api.get('/api/v1/todos');
        if(res.status === 200){
          dispatch(getTodos(res?.data?.getTodo))
        } else{
          dispatch(getTodoFailure(res?.data.msg))
        }
        
      } catch (error) {
        dispatch(getTodoFailure(error.response?.data.msg))
        if(error.response?.status === 401) {
          navigate('/login');
        }
      }
    }

    getAllItems();

  }, [dispatch, currentUser, navigate])


  return (
    <ul className='w-full lg:px-10 px-4 ul-items overflow-auto h-[500px]'>
      {
        lists.map(item => (
          <li key={item?._id} className='flex items-center justify-between w-full bg-gray-100 px-3 py-3 mb-3 hover:bg-[#e0dfff] hover:scale-105 shadow-shd'>
          <span className='text-xl font-semibold font-tf'>{item?.name}</span>
          <Link to={'/lists'}>
          <MdReadMore className='h-7 w-7 border-2 border-blue-500 rounded-full hover:bg-blue-200 font-bold cursor-pointer' />
          </Link>
        </li>
        ))
      }
      {
        lists.length === 0 && (
          <h1 className='text-4xl font-bold font-mono bg-[#7c7ced] p-3 text-center text-white'>Add Todo</h1>
        )
      }
    </ul>
  )
}

export default TodoList
