import { Button } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { MdLockPerson } from "react-icons/md";
import { FaThumbsUp } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import homebg from '../assets/home-img.jpg';
import darkImg from '../assets/darkImg.png';
import AIButton from '../components/AIButton';

const Home = () => {
  const {currentUser} = useSelector(state => state.user);
  return (
    <section className='w-full bg-[#e0dfff] dark:bg-[#e0dfff] dark:text-[#ababab] text-slate-800'>
       <div className='flex flex-col-reverse dark:bg-[#12113b] md:flex-row justify-center items-center'>
        <div className='py-28 md:px-10 px-3'>
         <h1 className='lg:text-7xl md:text-4xl sm:text-5xl  text-4xl font-bold text-[#5756eb] font-tf text-center dark:text-[#2eadbe]'>Welcome To Task Manager</h1>
         <div className='text-center dark:text-[#ababab]'>
         <p className='lg:text-2xl md:text-xl text-lg md:font-semibold text-[#b256df] dark:text-[#0195af] font-serif tracking-tight mt-4'>You can arrange and manage your task here.</p>
         <p className='lg:text-2xl md:text-xl text-lg md:font-semibold text-[#b256df] dark:text-[#0195af]  font-serif tracking-tight'>What are you waiting for start now!</p>
         <Link to={'/create'} className='flex justify-center items-center my-3'>
         <Button gradientDuoTone="purpleToBlue"  pill size={'xl'} className='lg:w-2/4 md:w-3/4 sm:w-2/4 w-full  font-tf font-semibold'><FaThumbsUp className="mr-2 h-5 w-5" />Start Now</Button>
         </Link>
     { !currentUser &&
     <>
         <p className='md:text-xl text-lg font-semibold  font-serif tracking-tight dark:text-[#ababab]'>Don't have an account sign-up here</p>
         <Link to={'/register'} className='flex justify-center items-center my-3'>
         <Button gradientDuoTone="purpleToBlue" pill size={'xl'} className='lg:w-2/4 md:w-3/4 sm:w-2/4 w-full font-tf font-semibold'><MdLockPerson className="mr-2 h-5 w-5" />Sign Up</Button>
         </Link>
         </>
         }
         </div>
        </div>
       <div className='home-bg md:mr-4 mr-0 mt-2 md:w-1/3 overflow-hidden'>
         <img src={homebg} className='md:w-[800px] w-[400px] dark:hidden hover:scale-110 transition-all duration-300' alt="home-img" />
         <img src={darkImg} className='md:w-[800px] w-[400px] hidden dark:block hover:scale-110 transition-all duration-300' alt="dark-home-img" />
         </div>
       </div>
       {/* Ask genai button */}
       <Link to={'/genai'}>
          <AIButton />
        </Link>
    </section>
  )
}

export default Home
