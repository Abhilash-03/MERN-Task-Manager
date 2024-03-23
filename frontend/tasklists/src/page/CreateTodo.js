import { Alert, TextInput, Toast } from 'flowbite-react'
import React, { useState } from 'react'
import { IoMdAddCircleOutline } from "react-icons/io";
import TodoList from '../components/TodoList';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, addTodoFailure } from '../redux/todo/todoSlice';
import api from '../axios/axios';
import { HiCheck, HiInformationCircle } from 'react-icons/hi';

const customTheme = {
    field: {
        colors: {
            gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 text-2xl",
        },
    input: {
        sizes: {
            lg: "sm:text-xl p-4 font-semibold font-tf rounded-full"
          },
          withAddon: {
            "off": "rounded-full"
          },
    },
  }
};

const CreateTodo = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const {error} = useSelector(state => state.todo);

  const handleAddTodo = async(e) =>{
    e.preventDefault(); 
    setMessage('')
    try {
      dispatch(addTodoFailure(null));
      const response = await api.post('/api/v1/todos', { name });
      if(response.status === 201) {
        dispatch(addTodo(response?.data?.todoList));
        setMessage('Success: Todo Created!')
      } else {
        dispatch(addTodoFailure(response?.data?.msg));
      }

      setName('');
    } catch (error) {
      dispatch(addTodoFailure(error.response?.data?.msg));
    }
  }

  return (
    <>
    {error &&  <Alert color="failure" icon={HiInformationCircle} className='font-semibold font-serif'>
    <span className="font-semibold font-tf">Info alert!</span> {error}.
  </Alert>}
  { message &&
      <Toast className='mx-auto'>
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
        <HiCheck className="h-5 w-5" />
      </div>
      <div className="ml-3 text-sm font-semibold font-tf text-green-400">{message}</div>
      <Toast.Toggle />
    </Toast>
  }
    <section className='flex px-10 flex-col lg:flex-row items-center justify-between'>
      
    <form onSubmit={handleAddTodo} className='min-w-[200px] max-w-[750px] lg:w-2/4 w-full flex mx-auto py-20 dark:bg-[#464385] bg-[#8a87e7] p-5 mt-10 rounded-3xl'>
    <TextInput id="name" type="text" color={customTheme} theme={customTheme} placeholder='Add Todo' sizing="lg" className='lg:w-[90%] w-full' value={name} onChange={(e) => setName(e.target.value)} required />
    <button className='w-16 h-16 bg-gray-800 mt-2 mx-2 rounded-full flex items-center justify-center'><IoMdAddCircleOutline  className='w-16 h-16 rounded-full text-[#c2c2fc] hover:text-[#7c7ced] ' /></button>
  </form>
   <div className='lg:w-2/4 w-full flex flex-col items-center justify-center bg-[#bdbdf5] dark:bg-[#4d4d75]  min-h-3/4 mx-5 my-10'>
     <h3 className='text-lg md:text-3xl font-serif font-semibold mb-7 mt-4 dark:text-[#ececec]'>Lists</h3>
    <TodoList />
   </div>
  </section>
  </>
  )
}

export default CreateTodo
