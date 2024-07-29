import { Alert, TextInput, Toast } from 'flowbite-react'
import React, { useRef, useState } from 'react'
import TodoList from '../components/TodoList';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, addTodoFailure } from '../redux/todo/todoSlice';
import api from '../axios/axios';
import { HiCheck, HiInformationCircle } from 'react-icons/hi';
import { MdAdd } from 'react-icons/md';

const customTheme = {
    field: {
        colors: {
            gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 text-2xl",
        },
    input: {
        sizes: {
            lg: "sm:text-xl p-4 font-semibold font-tf rounded-full dark:bg-gray-800 dark:text-gray-200"
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
  const inputRef = useRef();

  const handleInputRef = () => {
    inputRef.current.focus();
  }

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

  setTimeout(() => {
    dispatch(addTodoFailure(null));

  }, [1200]);

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
    <section className='flex md:px-10 px-3 flex-col lg:flex-row items-center justify-between'>
      
    <form onSubmit={handleAddTodo} className='min-w-[200px] max-w-[750px] lg:w-2/4 w-full flex items-center mx-auto md:py-20 dark:bg-[#464385] bg-[#8a87e7] p-5 mt-10 rounded-3xl relative'>
    <TextInput id="name" type="text" color={customTheme} theme={customTheme} placeholder='Add Todo' sizing="lg" className='lg:w-[90%] w-full' value={name} onChange={(e) => setName(e.target.value)} ref={inputRef} required />
    <button className='md:w-16 md:h-16 w-10 h-10 mt-2 mx-3 rounded-full flex items-center justify-center' onClick={handleInputRef}><MdAdd  className='md:w-14 md:h-14 w-10 h-10 text-[#ffffff] hover:text-[#d7d7e1] bg-gray-800 shadow-btnshd hover:shadow-hovershd hover:scale-90'/></button>
  </form>
   <div className='lg:w-2/4 w-full flex flex-col items-center justify-center bg-[#bdbdf5] dark:bg-[#4d4d75]  min-h-3/4 mx-5 my-10'>
     <h3 className='text-2xl md:text-3xl font-serif font-semibold mb-7 mt-4 dark:text-[#ececec]'>Lists</h3>
     {/* rendering lists */}
    <TodoList />
   </div>
  </section>
  </>
  )
}

export default CreateTodo
