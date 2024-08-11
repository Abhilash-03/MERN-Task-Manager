import { Alert, Textarea, TextInput, Toast } from "flowbite-react";
import React, { useRef, useState } from "react";
import TodoList from "../components/TodoList";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, addTodoFailure } from "../redux/todo/todoSlice";
import api from "../axios/axios";
import { HiCheck, HiInformationCircle } from "react-icons/hi";
import { MdAdd } from "react-icons/md";
import { FaPenFancy } from "react-icons/fa";
import { Link } from "react-router-dom";
import AIButton from "../components/AIButton";

const customTheme = {
  field: {
    colors: {
      gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 text-2xl",
    },
    input: {
      sizes: {
        lg: "sm:text-xl p-4 font-semibold font-tf rounded-2xl dark:bg-gray-800 dark:text-gray-200",
      },
      withAddon: {
        off: "rounded-2xl",
      },
    },
  },
};

const CreateTodo = () => {
  const [newTodo, setNewTodo] = useState({
    name: "",
    notes: "",
  });
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.todo);
  const inputRef = useRef();

  const handleInputRef = () => {
    inputRef.current.focus();
  };

  const handleOnChange = (e) => {
    setNewTodo({ ...newTodo, [e.target.name]: e.target.value });
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      dispatch(addTodoFailure(null));
      const response = await api.post("/api/v2/todos", newTodo);
      console.log(response.data);
      if (response.status === 201) {
        dispatch(addTodo(response?.data?.todoList));
        setMessage(response?.data?.msg);
      } else {
        dispatch(addTodoFailure(response?.data?.msg));
      }

      setNewTodo({ name: "", notes: "" });
    } catch (error) {
      dispatch(addTodoFailure(error.response?.data?.msg));
    }
  };

  setTimeout(() => {
    dispatch(addTodoFailure(null));
  }, [3200]);

  return (
    <>
      {error && (
        <Alert
          color="failure"
          icon={HiInformationCircle}
          className="font-semibold font-serif"
        >
          <span className="font-semibold font-tf">Info alert!</span> {error}.
        </Alert>
      )}
      {message && (
        <Toast className="mx-auto w-full">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-semibold font-tf text-green-400 w-full">
            {message}
          </div>
          <Toast.Toggle />
        </Toast>
      )}
      <section className="flex md:px-10 px-3 flex-col lg:flex-row items-center justify-between">
        <form
          onSubmit={handleAddTodo}
          className="min-w-[200px] max-w-[750px] lg:w-2/4 w-full flex flex-col items-center mx-auto md:py-20 dark:bg-[#464385] bg-[#8a87e7] p-5 mt-10 rounded-3xl relative space-y-3"
        >
          <TextInput
            id="name"
            name="name"
            type="text"
            color={customTheme}
            icon={FaPenFancy}
            theme={customTheme}
            placeholder="Write Todo*"
            sizing="lg"
            className="lg:w-[90%] w-full"
            value={newTodo.name}
            onChange={handleOnChange}
            ref={inputRef}
            required
            maxLength={"40"}
            minLength={"2"}
          />
          <Textarea
            id="notes"
            name="notes"
            type="text"
            color={customTheme}
            placeholder="Write your notes (optional)"
            sizing="lg"
            className="lg:w-[90%] w-full sm:text-lg p-4 font-semibold font-tf rounded-2xl dark:bg-gray-800 dark:text-gray-200 relative"
            value={newTodo.notes}
            onChange={handleOnChange}
            ref={inputRef}
            rows={4}
            maxLength={"150"}
          ></Textarea>
          <span className="bg-slate-100 dark:bg-slate-600 text-sm dark:text-slate-100 p-2 font-semibold font-serif rounded-md absolute md:bottom-40 md:right-14 right-8 bottom-24">
            {newTodo.notes.length}/150
          </span>
          <button
            className="md:w-2/4 md:h-16 w-3/4 h-14 mt-2 mx-3 rounded-full flex items-center justify-center text-2xl font-tf text-[#ffffff] hover:text-[#a5f4bd] dark:bg-gray-800 bg-indigo-800 shadow-btnshd hover:shadow-hovershd hover:scale-90"
            onClick={handleInputRef}
          >
            <MdAdd className="md:w-12 md:h-12 w-10 h-10" />
            Create
          </button>
        </form>
        <div className="lg:w-2/4 w-full flex flex-col items-center justify-center bg-[#bdbdf5] dark:bg-[#212147] rounded-2xl min-h-3/4 mx-5 my-10">
          <h3 className="text-2xl md:text-3xl font-serif font-semibold mb-7 mt-4 dark:text-[#ececec]">
            Lists
          </h3>
          {/* rendering lists */}
          <TodoList />
        </div>
      </section>
        {/* Ask genai button */}
        <Link to={'/genai'}>
          <AIButton />
        </Link>
    </>
  );
};

export default CreateTodo;
