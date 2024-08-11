import { Alert, Button, Dropdown, Toast } from 'flowbite-react';
import React, { useCallback, useEffect, useState } from 'react'
import { HiCheck, HiInformationCircle } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux'
import {  filterTodo, getTodoFailure, getTodos } from '../redux/todo/todoSlice';
import { Link, useNavigate } from 'react-router-dom';
import api from '../axios/axios'
import Cards from '../components/Cards';
import { MdCreateNewFolder, MdOutlinePendingActions } from "react-icons/md";
import { FaCheck, FaHeart, FaLeaf, FaRunning } from 'react-icons/fa';
import { logoutSuccess } from '../redux/user/userSlice';
const customTheme = {
  base: "flex md:max-w-xl max-w-md items-center rounded-lg md:p-4 p-1 text-gray-500 shadow dark:text-gray-400",
  floating: {
    style: {
      auto: "border border-gray-200 bg-indigo-400 text-gray-800 dark:border-none dark:bg-gray-800 dark:text-white"
    }
  }
}

const Lists = () => {
    const { lists, error, filteredTodo } = useSelector(state => state.todo);
    const { currentUser } = useSelector(state => state.user);
    const [message, setMessage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [filterName, setFilterName] = useState('all');

    const handleGetTodos = useCallback(() => {
      dispatch(getTodoFailure(null))
      const getAllItems = async() => {
        setTimeout(() => {
          if(currentUser === null) {
            navigate('/login')
          }
        }, 1000)
        try {
          const res = await api.get('/api/v2/todos');
          if(res.status === 200){
            dispatch(getTodos(res?.data?.getTodo));
          } else{
            dispatch(getTodoFailure(res?.data.msg))
          }
          
        } catch (error) {
          dispatch(getTodoFailure(error.res?.data.msg))
          if(error.response?.status === 401) {
            dispatch(logoutSuccess())
            navigate('/login');
          }
        }
      }
  
      getAllItems();
    }, [dispatch, currentUser, navigate])

    
    const filterTodos = (type) => {
      dispatch(filterTodo({ type }))
      setFilterName(type);
    }

    useEffect(() => {
      handleGetTodos();
      filterTodos(filterName);
    }, [filterName])

    setTimeout(() => {
      dispatch(getTodoFailure(null))
    }, 1200);


  return (
    <>
    {error &&  <Alert color="failure" icon={HiInformationCircle} className='font-semibold font-serif'>
    <span className="font-semibold font-tf">Info alert!</span> {error.name}.
  </Alert>}
    <h1 className='font-tf md:text-5xl text-4xl font-bold text-center mt-2 text-purple-800 dark:text-purple-500'><span className='capitalize'>{filterName}</span> [{filteredTodo.length}]</h1>
    <Button.Group className='justify-center mt-10 font-tf font-semibold md:flex hidden'>
      <Button color="purple"  onClick={() => filterTodos('all')}>
        <FaLeaf className="mr-3 h-4 w-4" />
        All
      </Button>
      <Button color="purple" onClick={() => filterTodos('pending')}>
        <MdOutlinePendingActions className="mr-3 h-4 w-4" />
        Pending
      </Button>
      <Button color="purple" onClick={() => filterTodos('completed')}>
        <FaCheck className="mr-3 h-4 w-4" />
        Completed
      </Button>
      <Button color="purple" onClick={() => filterTodos('in-working')}>
        <FaRunning className="mr-3 h-4 w-4" />
        In-working
      </Button>
      <Button color="purple" onClick={() => filterTodos('favourite')}>
        <FaHeart className="mr-3 h-4 w-4" />
        Favourite
      </Button>
    </Button.Group>
<div className='md:hidden flex items-center justify-center mt-3 font-serif'>
    <Dropdown label={filterName.toUpperCase()} gradientDuoTone={'purpleToBlue'} theme={customTheme} pill>
      <Dropdown.Item icon={FaLeaf} className="font-tf" onClick={() => filterTodos('all')}>All</Dropdown.Item>
      <Dropdown.Item icon={MdOutlinePendingActions} className="font-tf" onClick={() => filterTodos('pending')}>Pending</Dropdown.Item>
      <Dropdown.Item icon={FaRunning} className="font-tf" onClick={() => filterTodos('in-working')}>In-working</Dropdown.Item>
      <Dropdown.Item icon={FaCheck} className="font-tf" onClick={() => filterTodos('completed')}>Completed</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item icon={FaHeart} className="font-tf" onClick={() => filterTodos('favourite')}>Favourite</Dropdown.Item>
    </Dropdown>
    </div>
  { message &&
      <Toast className='mx-auto' theme={customTheme}>
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
        <HiCheck className="h-5 w-5" />
      </div>
      <div className="ml-3 text-sm font-semibold font-tf text-green-400">{message}</div>
      <Toast.Toggle />
    </Toast>
  }
    <section className={`grid grid-cols-1 gap-3 lg:gap-5 md:grid-cols-2 lg:grid-cols-3 mx-5 my-10 ${lists.length > 0 && "h-[65vh]"} overflow-y-auto overflow-x-hidden px-3`}>
      {filterName === 'all'?
         lists.map(todo => (
          <Cards key={todo._id} todo={todo} setMessage={setMessage} handleGetTodos={handleGetTodos} />
          
        ))
        :
        filteredTodo.map(todo => (
        <Cards key={todo._id} todo={todo} setMessage={setMessage} handleGetTodos={handleGetTodos} />
        ))
      }

    </section>
    {
      lists.length === 0 && (
        <div className='flex items-center justify-center bg-[#7c7ced] sm:w-3/4 w-full mx-auto py-4 flex-col shadow-shd dark:shadow-lg dark:bg-pink-500 rounded-2xl'>
        <h1 className='sm:text-2xl text-lg font-bold font-tf flex items-center justify-center p-3 text-gray-800'>Todo list is empty, create a new one.</h1>
        <Link to={'/create'}>
        <Button  gradientMonochrome="purple" className='my-4 font-tf font-bold' size={'lg'} pill>
          <MdCreateNewFolder className="mr-2 h-5 w-5" />
        Create</Button>
        </Link>
        </div>
      )
    }
    </>
  )
}

export default Lists
