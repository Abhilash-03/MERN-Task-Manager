import { Badge, Button } from "flowbite-react"
import { HiClock, HiPencilAlt, HiTrash } from "react-icons/hi"
import { addFavouriteFailure, deleteTodo, deleteTodoFailure } from "../redux/todo/todoSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import api from '../axios/axios';
import EditModal from "./EditModal";
import { FaRegStar, FaStar } from "react-icons/fa";
import { MdDoneAll, MdOutlinePendingActions } from "react-icons/md";
import { FaPersonRunning } from "react-icons/fa6";


const Cards = ({ todo, setMessage, handleGetTodos }) => { 
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();

  const handleRemoveTodo = async(id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/api/v2/todos/${id}`);
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
      const response = await api.patch(`/api/v2/todos/favourite/${id}`, { favourite: addFavourite });
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
    <div className={`p-3 ${todo.status === 'completed' ? 'bg-[#6868f4] text-gray-800 hover:bg-[#6161ed]' : todo.favourite ? 'bg-[#652fb8] text-slate-200 hover:bg-[#7e48cf] hover:text-gray-900' :  'bg-[#bdbdf5]'} dark:bg-gray-800 dark:text-white m-3 md:max-w-xl lg:max-w-2xl max-w-md mx-auto md:h-[350px] w-full text-xl font-semibold font-serif relative shadow-shd dark:shadow-black hover:scale-95 hover:bg-[#9090e3] rounded-lg transition-all duration-200 ease-in`}>
      {
        todo.favourite ? <FaStar className="absolute -top-2 right-0 h-5 w-5 text-[#dd4be8] cursor-pointer" onClick={() => handleAddFavourite(todo._id, false)} />
        : <FaRegStar className="absolute -top-2 right-0 h-5 w-5 text-[#3838f0] cursor-pointer" onClick={() => handleAddFavourite(todo._id, true)}/>
     
      }
    <div className="p-1 gap-4 flex flex-col">
    <Badge color="indigo" icon={HiClock} className="md:w-2/4 justify-center text-sm">
        {new Date(todo.createdAt).toDateString()}
      </Badge>
      <div className="flex md:flex-row flex-col justify-around items-center">

      <div className={`flex flex-col items-center justify-center capitalize font-tf ${todo.notes ? 'md:w-2/4': 'w-full'}`}>
        <h1 className="text-2xl md:text-xl xl:text-2xl font-semibold text-center">{todo.name}</h1>
        {
          todo.status === 'pending' ? (
            <Badge color={'red'} icon={MdOutlinePendingActions} className="my-2">
            {todo.status}
          </Badge>
          ) : todo.status === 'in-working' ? (
            <Badge color={'warning'} icon={FaPersonRunning} className="my-2">
            {todo.status}
          </Badge>
          ) : (
            <Badge color={'success'} icon={MdDoneAll} className="my-2">
            {todo.status}
          </Badge>
          )
        }
      </div>
      {
        todo.notes && (
          <div className="bg-slate-100 text-gray-700 dark:bg-slate-900 dark:text-slate-200 py-4 px-3 rounded-xl max-w-2xl h-48 md:w-3/4 w-5/6 ml-3 overflow-y-auto">
            <p className="text-red-400 text-sm p-0">--Notes--</p>
          <p className="px-2 py-4 font-serif md:text-lg text-base hyphens-auto">{todo.notes}</p>
      </div>
        )
      }
    </div>
    </div>
    <div className='flex justify-between items-center space-x-3'>
    <Button  gradientMonochrome="purple" className='w-2/4 my-4 ' onClick={() => setOpenModal(true)}>
    <HiPencilAlt className="mr-2 h-5 w-5" />
        Edit</Button>
    <Button  gradientDuoTone="purpleToBlue" className='w-2/4 my-4 ' onClick={() => handleRemoveTodo(todo._id)} disabled={loading ? true : false}>
    <HiTrash className="mr-2 h-5 w-5" />
     {loading ? "Deleting....":"Delete"}</Button>
    </div>

    {
  openModal && <EditModal openModal={openModal} setOpenModal={setOpenModal} todo={todo} setMessage={setMessage} handleGetTodos={handleGetTodos} />
}
</div>

  )
}

export default Cards
