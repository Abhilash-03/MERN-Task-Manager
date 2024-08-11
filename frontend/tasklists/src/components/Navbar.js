import { Avatar, Button, Dropdown, Navbar, Toast } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { toggleTheme } from '../redux/theme/themeSlice';
import api from '../axios/axios'
import { logoutSuccess } from '../redux/user/userSlice';
import { useState } from 'react';
import { HiCheck, HiLogin, HiLogout, HiUser } from 'react-icons/hi';

const customTheme = {
  content: "py-1 focus:outline-none dark:bg-slate-800 dark:text-red-500 rounded-md",
  link: {
    active: {
      on: "bg-indigo-500 text-gray-200 dark:text-white md:bg-transparent md:text-indigo-700"
    }
  }
}

const Header = () => {
  const {currentUser} = useSelector(state => state.user);
  const {theme} = useSelector(state => state.theme);
 const dispatch = useDispatch();
 const [message, setMessage] = useState('');
 const navigate = useNavigate();
 const location = useLocation();
 const path = location.pathname;

 const handleLogout = async() => {
  try {
    const response = await api.post('/api/v1/auth/logout');
    dispatch(logoutSuccess())
    setMessage(response?.data?.msg);
    navigate('/login');

  } catch (error) {
     console.log(error.response?.data?.msg);
  }
 }
 setTimeout(() => {
  setMessage('');
 }, 3000)

  return (
    <>
    { message &&
      <Toast className='absolute z-20 top-20 lg:left-1/3 left-5'>
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
        <HiCheck className="h-5 w-5" />
      </div>
      <div className="ml-3 text-sm font-semibold font-tf">{message}</div>
      <Toast.Toggle />
    </Toast>
  }
    <Navbar fluid className='bg-[#c8c9f4ae] backdrop-blur-sm text-gray-800 sticky top-0 z-10' theme={customTheme}>
      <Link to={'/'}>
      <Navbar.Brand as={'div'}>
        <span className="self-center whitespace-nowrap text-xl font-semibold sm:text-xl md:text-4xl font-serif dark:text-[#2eadbe]">Task Manager</span>
      </Navbar.Brand>
      </Link>
      <div className="flex items-center md:mx-4 md:space-x-4 space-x-2 md:order-2">
        <div className='rounded-full bg-blue-400 p-1 cursor-pointer'  onClick={() => dispatch(toggleTheme())}>
        { theme === 'light' ?
        <MdDarkMode className='md:h-6 md:w-6 h-5 w-5' />
        : <MdLightMode className='md:h-6 md:w-6 h-5 w-5' />
       }
        </div>
   { currentUser ?
        <Dropdown
          arrowIcon={false}
          theme={customTheme}
          inline
          label={
            <Avatar alt="User settings" img={currentUser?.profilePicture} className='object-cover hover:bg-gray-600 rounded-full h-10 w-10 transition-all duration-300 bg-gray-800' rounded size={'sm'} />
            
          }
        >
          
          <Dropdown.Header>
            <span className="block text-sm font-semibold font-serif">@{currentUser?.username}</span>
            <span className="block truncate text-sm font-semibold font-serif">{currentUser?.email}</span>
          </Dropdown.Header>
          <Link to={`/user-profile/${currentUser._id}?tab=profile`}>
          <Dropdown.Item className="text-sm font-semibold font-serif"><HiUser className="mr-2 h-5 w-5" />Profile</Dropdown.Item>
          </Link>
          <Dropdown.Divider />
          <Dropdown.Item className="text-sm font-semibold font-serif" onClick={handleLogout}><HiLogout className="mr-2 h-5 w-5" />Sign out</Dropdown.Item>
        </Dropdown>
        : (
          <Link to={'/login'}>
            <Button gradientDuoTone="purpleToBlue" pill> <HiLogin className="mr-2 h-5 w-5" /> SignIn</Button>
          </Link>
        )
        }
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Link to='/'>
        <Navbar.Link active={path === '/' ? true: false} className='text-lg font-semibold font-tf' as={'div'}>
          Home
        </Navbar.Link>
        </Link>
        <Link to='/create'>
        <Navbar.Link active={path === '/create' ? true: false} className='text-lg font-semibold font-tf' as={'div'}>
          Create
        </Navbar.Link>
        </Link>
        <Link to='/lists'>
        <Navbar.Link active={path === '/lists' ? true: false} className='text-lg font-semibold font-tf' as={'div'}>
          Lists
        </Navbar.Link>
        </Link>
        {/* <Link to='/restore'>
        <Navbar.Link className='text-lg font-semibold font-tf' as={'div'}>
          Restore/Delete
        </Navbar.Link>
        </Link> */}
        <Link to='/genai'>
        <Navbar.Link className='text-lg font-semibold font-tf' as={'div'}>
          GenAI
        </Navbar.Link>
        </Link>
      
      </Navbar.Collapse>
    </Navbar>
    </>
  );
}

export default Header;