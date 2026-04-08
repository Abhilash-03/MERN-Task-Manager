import React, { useEffect, useRef, useState } from 'react'
import SideBar from '../components/Sidebar'
import { Alert, Button, FileInput, TextInput } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';
import api from '../axios/axios';
import { HiEye, HiEyeOff, HiMail, HiUser } from 'react-icons/hi'
import { MdPassword } from 'react-icons/md'
import { FaSave } from 'react-icons/fa'

const UpdateProfile = () => {
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [updateUser, setUpdateUser] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const {currentUser, loading} = useSelector(state => state.user);
    const {uid} = useParams();
    const fileRef = useRef(null);
    const dispatch = useDispatch();

    const handleImageFile = (e) => {
        const file = e.target.files[0];
        if(file){
            setImageFile(file);
            setImageUrl(URL.createObjectURL(file));
        }
    }

    const uploadImage = async() => {
        const storage = getStorage(app);
        const filename = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        setImageFileUploading(true);
        setUploadError(null);

        uploadTask.on(
            'state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageUploadProgress(progress.toFixed(0));
            },
          (error) => {
              setUploadError('Image could not upload (Image must be less than 5 MB)', error.message);
              setImageUploadProgress(null);
              setImageUrl(null);
              setImageFileUploading(false);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                setImageUrl(downloadUrl);
                setUpdateUser({...updateUser, profilePicture: downloadUrl});
                setImageUploadProgress(null);
                setImageFileUploading(false);
            })
          }
        )
            
    }

    useEffect(() => {
        if(imageFile){
            uploadImage();
        }
    }, [imageFile])

    const handleOnChange = (e) => {
        setUpdateUser({...updateUser, [e.target.id]: e.target.value});
    }

    const handleUpdateUser = async() => {
       setUpdateUserError(null);
       setUpdateUserSuccess(null);
       if(Object.keys(updateUser).length === 0){
        setUpdateUserError("No changes made.");
        return;
       }
       if(imageFileUploading){
        setUpdateUserError("Please wait for image to upload");
       }

       try {
        dispatch(updateStart());
        const {data} = await api.patch(`api/v1/user/update-profile/${uid}`, updateUser);
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
        
       } catch (error) {
        dispatch(updateFailure(error?.response?.data?.msg));
        setUpdateUserError(error.response?.data?.msg)
       }
    }
    
    setTimeout(() => {
        setUpdateUserSuccess(null);
        setUpdateUserError(null);
    }, 6200);

  return (
    <>
     {
    uploadError && (
        <Alert color='failure' className='font-tf font-semibold'>
         {uploadError}
       </Alert>
    )
    }
    <div className='flex flex-col lg:flex-row'>
    <SideBar />
     <div className='w-full'>
        <div className='h-40 w-full bg-gradient-to-r from-slate-800 via-blue-700 to-slate-900 relative mb-20'>
        {imageUploadProgress && (
            <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress}%`}
             strokeWidth={6}
             background
             backgroundPadding={3}
             styles={buildStyles({
               backgroundColor: "#14306e",
               textColor: "#fff",
               pathColor: "#7998db",
               trailColor: "transparent",
              path: {
                stroke: `rbga(162,102,239, ${imageUploadProgress / 100})`
              }
             })}
              className='h-40 absolute top-14'
            />
          ) }
            <img src={ imageUrl || currentUser.profilePicture} alt="user-dp" className={`absolute -translate-x-1/2 left-1/2 -bottom-10 rounded-full h-32 w-32 object-cover cursor-pointer hover:brightness-75 border-2 border-blue-700 shadow-shd ${imageUploadProgress && imageUploadProgress < 100 && 'opacity-15 animate-pulse'}`}  onClick={()=> fileRef.current.click()} />
            <FileInput className='hidden' ref={fileRef} onChange={handleImageFile} />
        </div>
 
        <div className='max-w-2xl md:mx-auto font-tf space-y-3 bg-blue-400 dark:bg-[#09234d] px-5 py-6 rounded-2xl mx-4'>
        <div>
           <TextInput type='text' sizing={'lg'} id='username' placeholder='Change username' defaultValue={currentUser.username || updateUser.username} onChange={handleOnChange} className='' icon={HiUser} />
        </div>
        <div>
           <TextInput type='email' sizing={'lg'} id='email' placeholder='Change email' defaultValue={currentUser.email} onChange={handleOnChange} className='' icon={HiMail} />
        </div>
        <div className="relative">
           <TextInput type={showPassword ? "text" : "password"} sizing={'lg'} id='password' placeholder='Change password' onChange={handleOnChange} className='' icon={MdPassword} />
           <span className="absolute top-3 right-3 text-xl cursor-pointer h-9 w-9 hover:text-blue-500 hover:bg-gray-800 dark:text-white hover:rounded-full p-2" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <HiEye/> :  <HiEyeOff/> }</span>
        </div>
        <Button color={'blue'} onClick={handleUpdateUser} className='w-full' size={'lg'} disabled={loading || imageFileUploading ? true : false}>
        <FaSave className="mr-2 h-5 w-5" />
          {loading ? "Saving..." : "Save changes"}</Button>

        {updateUserSuccess && (
          <Alert color={'success'} className="mt-5 font-semibold">
            {updateUserSuccess}
          </Alert>
         )}
         {
           updateUserError && (
            <Alert color={'failure'} className="mt-5 font-semibold">
            {updateUserError}
          </Alert>
           )
         }
     </div>
     </div>
    </div>
    </>
  )
}

export default UpdateProfile
