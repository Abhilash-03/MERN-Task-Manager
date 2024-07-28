import { Button } from 'flowbite-react'
import React from 'react'
import { FaGoogle } from 'react-icons/fa'
import { app } from '../firebase'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import api from '../axios/axios';
import { useDispatch } from 'react-redux';
import { loginFailure, loginSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
    const dispatch = useDispatch();
    const auth = getAuth(app);
    const navigate = useNavigate();
    const handleOAuth = async() => {
        const provider = new GoogleAuthProvider();
        provider.getCustomParameters({ prompt: 'select_account'});
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            const newUser = {
                name: resultsFromGoogle.user.displayName,
                email: resultsFromGoogle.user.email,
                googlePhotoUrl: resultsFromGoogle.user.photoURL
            };
            const res = await api.post('/api/v1/auth/googleAuth', newUser);
            if(res.status === 200) {
                dispatch(loginSuccess(res?.data));
                setTimeout(() => {
                    navigate('/create');
                }, 2100);
              } else {
                dispatch(loginFailure(res?.data.msg));
              }

        } catch (error) {
            console.log("Error occured: ", error.message);
            dispatch(loginFailure(error.message));
            }

    }
  return (
    <Button className="md:w-2/4 m-auto h-14 font-tf font-semibold" gradientDuoTone="purpleToBlue" pill onClick={handleOAuth}>
    <FaGoogle className="mr-2 h-5 w-5"  />
    Continue with Google
  </Button>
  )
}

export default OAuth
