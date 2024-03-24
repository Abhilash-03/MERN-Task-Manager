import { Button } from "flowbite-react"
import { HiPencilAlt, HiTrash } from "react-icons/hi"
import { addFavouriteFailure, deleteTodo, deleteTodoFailure } from "../redux/todo/todoSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import api from '../axios/axios';
import EditModal from "./EditModal";
import { FaCheckDouble, FaRegStar, FaStar } from "react-icons/fa";
import { GiCrossMark } from "react-icons/gi";

const Cards = ({ todo, setMessage, handleGetTodos }) => { 
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();

  const handleRemoveTodo = async(id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/api/v1/todos/${id}`);
      if(response) {
        dispatch(deleteTodo())
        handleGetTodos();
        setMessage(response?.data?.msg);
        setLoading(false);
        setTimeout(() => {
          setMessage('');
        }, 1200)

      } else {
       dispatch(deleteTodoFailure(response?.data.msg));
       setLoading(false);

      }
     } catch (error) {
       dispatch(deleteTodoFailure(error.response?.data.msg))
       setLoading(false);

     }
  }
  
  const handleAddFavourite = async(id, addFavourite) => {
     try {
      const response = await api.patch(`/api/v1/todos/favourite/${id}`, { favourite: addFavourite });
      if(response) {
        handleGetTodos();
        if(addFavourite){
          setMessage(response?.data?.msg);
        } else {
          setMessage("Remove from favourite");
        }
        setTimeout(() => {
          setMessage('');
        }, 1200);
      }
     } catch (error) {
      dispatch(addFavouriteFailure(error.response?.data?.msg));
     }  
  }


  return (
    <div className={`p-3 ${todo.completed ? 'bg-[#6868f4] text-gray-800 hover:bg-[#6161ed]' : todo.favourite ? 'bg-[#652fb8] text-slate-200 hover:bg-[#7e48cf] hover:text-gray-900' :  'bg-[#bdbdf5]'} m-3 max-w-sm text-xl font-semibold font-serif relative shadow-shd dark:shadow-red-200 hover:scale-105 hover:bg-[#9090e3] rounded-lg`}>
      {
        todo.favourite ? <FaStar className="absolute -top-2 right-0 h-5 w-5 text-[#dd4be8]" onClick={() => handleAddFavourite(todo._id, false)} />
        : <FaRegStar className="absolute -top-2 right-0 h-5 w-5 text-[#3838f0]" onClick={() => handleAddFavourite(todo._id, true)}/>
     
      }
    <div className="p-1 gap-2 flex flex-col">
       <p className='font-tf'>
        <span className='font-serif'>Title:</span> <span>{todo.name}</span>
       </p>
       <p className='font-tf flex space-x-5'>
       <span className='font-serif'>Completed:</span> <span>{todo.completed ? <FaCheckDouble className="h-7 w-7 text-green-500 bg-white p-1 rounded-full" /> : <GiCrossMark className="h-7 w-7 text-red-500 bg-gray-800 p-1 rounded-full"  />}</span>
       </p>
       <p className='font-tf'>
       <span className='font-serif'>Created:</span> <span>{(todo.createdAt).slice(0, 10)}</span>
       </p>
    </div>
    <div className='flex justify-between items-center space-x-3'>
    <Button  gradientMonochrome="purple" className='w-2/4 my-4 ' onClick={() => setOpenModal(true)}>
    <HiPencilAlt className="mr-2 h-5 w-5" />
        Edit</Button>
    <Button  gradientDuoTone="purpleToBlue" className='w-2/4 my-4 ' onClick={() => handleRemoveTodo(todo._id)} disabled={loading ? true : false}>
    <HiTrash className="mr-2 h-5 w-5" />
     {loading ? "loading....":"Delete"}</Button>
    </div>

    {
  openModal && <EditModal openModal={openModal} setOpenModal={setOpenModal} todo={todo} setMessage={setMessage} handleGetTodos={handleGetTodos} />
}
</div>

  )
}

export default Cards
