import { Alert, Button, Label, Spinner, TextInput, Toast } from "flowbite-react"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from '../axios/axios'
import { HiFire, HiInformationCircle } from 'react-icons/hi';
import { useDispatch, useSelector } from "react-redux";
import { signupSuccess, singupFailure, start } from "../redux/user/userSlice";

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
          "off": "rounded-full"
        },
  },
},
  size: {
    lg: "text-xl font-serif px-5 py-2.5 dark:text-gray-800 font-bold"
  }
};

const Signup = () => {
  const [formData, setFormData] = useState(null);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading} = useSelector(state => state.user);


  const handleSubmit = async(e) => {
    e.preventDefault();
    dispatch(start());
    try {
      const response = await api.post('/api/v1/auth/register', formData);
      setMsg(`User "${response.data.username}" signed-up!`);
      dispatch(signupSuccess());
      setTimeout(() => {
          navigate('/login')
      }, 3000);
    } catch (error) {
      console.log(error.response?.data);
      const errormsg = error.response?.data?.msg;
      if(errormsg?.code === 11000) {
        const errmsg = ( Object.values(errormsg.keyValue)[0])
        dispatch(singupFailure(errmsg));
      }
    }
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl mx-auto flex-col gap-4 p-4 bg-[#a2a2e3] dark:bg-[#4d4d75] dark:text-[#ece9f3] my-10 rounded-xl">
          {error &&   <Alert color="failure" icon={HiInformationCircle} className="font-semibold font-serif">
      <span className="font-semibold font-tf">Error:</span> '{error}' is already taken or using by other user.
    </Alert>}
{ msg &&
        <Toast className="mb-3 mx-auto">
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200 ">
        <HiFire className="h-5 w-5" />
      </div>
      <div className="ml-3 text-sm font-semibold font-tf">{msg}</div>
      <Toast.Toggle />
    </Toast>
    }
      <h3 className="text-4xl font-bold font-tf text-center">Sign-up</h3>
      <p className="text-md font-semibold text-center">Already have an account <Link to={'/login'} className="text-blue-800 underline dark:text-[#8dbebe] dark:hover:text-blue-300 hover:text-blue-500">SingIn</Link>?</p>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="username" className="text-xl font-serif font-bold" value="Your username" />
        </div>
        <TextInput id="username" type="text"  sizing={'lg'} color={customTheme} theme={customTheme}  placeholder="username" onChange={handleChange} required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email" className="text-xl font-serif font-bold" value="Your email" />
        </div>
        <TextInput id="email" type="email" sizing={'lg'} color={customTheme} theme={customTheme}  placeholder="name@gmail.com" onChange={handleChange} required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password1" className="text-xl font-serif font-bold" value="Your password" />
        </div>
        <TextInput id="password" sizing={'lg'} color={customTheme} theme={customTheme} placeholder="********" type="password" onChange={handleChange} required />
      </div>
      <Button type="submit" gradientMonochrome={'purple'} theme={customTheme} disabled={loading} size={'lg'} pill>{loading ? <> <Spinner aria-label="Alternate spinner button example" size="sm" />
        <span className="pl-3">Processing...</span> </> : 'Singup'}</Button>
    </form>
  )
}

export default Signup
