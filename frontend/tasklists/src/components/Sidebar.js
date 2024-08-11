import { HiUser } from 'react-icons/hi'
import { Sidebar } from "flowbite-react";
import { useSelector } from 'react-redux';
import { MdOutlineUpdate } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const customTheme = {
   root: {
       inner: "h-full overflow-y-auto overflow-x-hidden lg:fixed rounded bg-indigo-300 px-3 py-4 dark:bg-gray-800"
   }
}

const SideBar = () => {
    const { currentUser } = useSelector(state => state.user);
    const location = useLocation();
    const [tab, setTab] = useState('');

    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      setTab(tabFromUrl);
    }, [location.search])

  return (
    <Sidebar aria-label="Default sidebar example" theme={customTheme} className='lg:h-screen w-full lg:w-60'>
    <Sidebar.Items className='font-tf'>
      {
        currentUser &&
      <Sidebar.ItemGroup>
        <Link to={`/user-profile/${currentUser._id}?tab=profile`}>
        <Sidebar.Item icon={HiUser} as='div' className={`${tab === "profile" ? "bg-black text-gray-200 hover:text-gray-600" : ""} my-2`}>
          Profile
        </Sidebar.Item>
        </Link>
        <Link to={`/update-profile/${currentUser._id}?tab=update`}>
        <Sidebar.Item icon={MdOutlineUpdate} as='div' className={`${tab === "update" ? "bg-black text-gray-200 hover:text-gray-600" : ""} my-2`}>
          Update Profile
        </Sidebar.Item>
        </Link>
      </Sidebar.ItemGroup>
      }
    </Sidebar.Items>
  </Sidebar>
  )
}

export default SideBar
