import { Button, Label, Modal, Select, Textarea, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import api from '../axios/axios'
import { useDispatch } from 'react-redux';
import { updateTodoFailure } from '../redux/todo/todoSlice';

const customTheme = {
    field: {
        colors: {
            gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 text-2xl",
        },
    input: {
        sizes: {
            lg: "sm:text-md p-4 font-semibold font-tf rounded-full dark:text-gray-700"
          },
          withAddon: {
            "off": "rounded-2xl"
          },
    },
  },
    size: {
      lg: "text-xl font-serif px-5 py-2.5"
    },

    show: {
      on: "flex bg-gray-900 bg-opacity-10 dark:bg-opacity-80",
      off: "hidden"
    },
    content: {
        base: "relative h-full md:bg-indigo-300 bg-none  w-full p-4 md:h-auto",
        inner: "relative rounded-lg bg-white shadow dark:bg-gray-700 flex flex-col max-h-[90dvh]"
      },
      body: {
        base: "p-6 flex-1 bg-indigo-200 overflow-auto",
        popup: "pt-0"
      },
      header: {
        base: "flex items-start bg-indigo-400 justify-between text-gray-800 rounded-t dark:border-gray-600 dark:bg-slate-600 border-b p-5",
        popup: "p-2 border-b-0",
        title: "text-xl font-medium text-green-900 dark:text-gray-200 dark:text-white",
        close: {
          base: "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-700 hover:bg-gray-200 font-bold hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white",
          icon: "h-5 w-5 font-bold"
        }
      },
  };

const EditModal = ({ setOpenModal, openModal, todo, setMessage, handleGetTodos}) => {
  const [editFormData, setEditFormData] = useState({
      name: todo.name,
      notes: todo.notes,
      status: todo.status
  });
  const dispatch = useDispatch();
  function onCloseModal() {
    setOpenModal(false);
    setEditFormData({
        name: todo.name,
        notes: todo.notes,
        status: todo.status
    });
  }

  const handleUpdateTodo = async(id) => {
    try{
     const response = await api.patch(`/api/v2/todos/${id}`, editFormData);
     if(response) {
      handleGetTodos();
      setMessage(response.data.msg)
      setOpenModal(false);
      setTimeout(() => {
       setMessage('')
      }, 1700);
     } else {
        dispatch(updateTodoFailure("Something went wrong!"))
     }
    } catch(error) {
       dispatch(updateTodoFailure(error.response?.data?.msg))
    }
  }

  return (
    <Modal show={openModal} theme={customTheme} size="md" onClose={onCloseModal} className='' popup>
    <Modal.Header />
    <Modal.Body>
      <div className="space-y-6">
        <h3 className="text-2xl font-bold font-tf">Edit Todo</h3>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name" value="Edit Name" className='text-lg font-serif font-bold' />
          </div>
          <TextInput
            id="name"
            placeholder="Edit name"
            value={editFormData.name}
            onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
            required
            theme={customTheme}
            sizing={'lg'}
            maxLength={'40'}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="notes" value="Edit Notes" className='text-lg font-serif font-bold' />
          </div>
          <Textarea
            id="notes"
            placeholder="Edit notes"
            value={editFormData.notes}
            onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
            className='sm:text-md p-4 font-semibold font-tf rounded-2xl dark:text-gray-700'
            sizing={'lg'}
            rows={4}
            maxLength={'150'}
          ></Textarea>
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="notes" value="Edit Status" className='text-lg font-serif font-bold' />
          </div>
          <Select
            id="status"
            value={editFormData.status}
            onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
            className='sm:text-md font-semibold font-tf rounded-2xl dark:text-gray-700'
            sizing={'lg'}
          >
            <option value="pending">Pending</option>
            <option value="in-working">In-working</option>
            <option value="completed">Completed</option>
          </Select>
        </div>
       <div className='flex items-center justify-between flex-wrap'>
        <Button gradientMonochrome={'info'} onClick={onCloseModal} pill>Cancel</Button>
        <Button gradientMonochrome={'success'} pill onClick={() => handleUpdateTodo(todo._id)}>Save</Button>
       </div>
      </div>
    </Modal.Body>
  </Modal>
  )
}

export default EditModal
