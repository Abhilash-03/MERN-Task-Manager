import { Alert, Button } from 'flowbite-react';
import React, { useState } from 'react'
import { FaDeleteLeft } from 'react-icons/fa6';
import { HiInformationCircle, HiLogout } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { logoutSuccess } from '../redux/user/userSlice';
import api from '../axios/axios';
import { WarningModal } from '../components/Modal';

const UserProfile = () => {
   const [openModal, setOpenModal] = useState(false);
    const { currentUser, error } = useSelector(state => state.user);
    const dispatch = useDispatch();
   const navigate = useNavigate();
    const handleLogout = async() => {
        try {
          await api.post('/api/v1/auth/logout');
          dispatch(logoutSuccess())
          navigate('/login');
      
        } catch (error) {
           console.log(error.response?.data?.msg);
        }
       }
       
  return (
    <>
      {error &&   <Alert color="failure" icon={HiInformationCircle} className="font-semibold font-serif">
      <span className="font-semibold font-tf">Info alert!</span> {error}
    </Alert>}
    <div className='profile max-w-4xl lg:mx-auto bg-slate-200 mt-10 rounded-2xl shadow-shd mx-4 relative h-[500px] dark:bg-gray-800 '>
        <h1 className='text-center text-2xl md:text-3xl font-bold font-tf py-5 underline dark:text-gray-300'>Account Details</h1>
        <img src={currentUser?.profilePicture} alt="profile-img" className='absolute rounded-full h-14 w-14 -top-3 -left-3 hover:brightness-75 cursor-pointer border-2 border-blue-300' />
       <div className="dtls max-w-2xl mx-auto py-4 px-3">
        <div className="first flex flex-col md:flex-row md:items-center justify-between border-b-2 border-blue-400 bg-blue-200 px-3 py-4 mb-4 hover:bg-blue-300 rounded-xl relative">
            <h4 className='md:text-lg text-sm bg-gray-100 dark:bg-gray-800 dark:text-white p-1 rounded-md font-bold font-tf absolute -top-3 md:static md:bg-transparent md:dark:bg-transparent md:dark:text-black w-20 text-center'>Username</h4>
            <h5 className='font-serif md:text-lg text-sm pt-2 font-semibold'>{currentUser?.username}</h5>
        </div>
        <div className="first flex flex-col md:flex-row md:items-center justify-between border-b-2 border-blue-400 bg-blue-200 px-3 py-4 mb-4 hover:bg-blue-300 rounded-xl relative">
            <h4 className='md:text-lg text-sm bg-gray-100 dark:bg-gray-800 dark:text-white p-1 rounded-md font-bold font-tf absolute -top-3 md:static md:bg-transparent md:dark:bg-transparent md:dark:text-black w-20 text-center'>Email</h4>
            <h5 className='font-serif md:text-lg text-sm pt-2 font-semibold'>{currentUser?.email}</h5>
        </div>
        <div className="first flex flex-col md:flex-row md:items-center justify-between border-b-2 border-blue-400 bg-blue-200 px-3 py-4 mb-4 hover:bg-blue-300 rounded-xl relative">
            <h4 className='md:text-lg text-sm bg-gray-100 dark:bg-gray-800 dark:text-white p-1 rounded-md font-bold font-tf absolute -top-3 md:static md:bg-transparent md:dark:bg-transparent md:dark:text-black w-20 text-center'>UID</h4>
            <h5 className='font-serif md:text-lg text-sm pt-2 font-semibold'>{currentUser?._id}</h5>
        </div>
  

        <div className="flex items-center justify-between flex-wrap-reverse gap-2">
      <Button gradientDuoTone="pinkToOrange" className='font-serif font-bold w-full sm:w-auto' onClick={() => setOpenModal(true)}>
        <FaDeleteLeft className="mr-2 h-5 w-5" />
        Delete Account
      </Button>
      <Button gradientDuoTone="purpleToBlue" className='font-serif font-bold w-full sm:w-auto' onClick={handleLogout}>
        Logout
        <HiLogout className="ml-2 h-5 w-5" />
      </Button>
    </div>
       </div>
      
      {/* Modal */}
      <WarningModal openModal={openModal} setOpenModal={setOpenModal} />
    </div>
    </>

  )
}

export default UserProfile