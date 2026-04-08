import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='w-full flex flex-col justify-center items-center my-40 max-w-3xl mx-auto dark:bg-slate-800 bg-[#96baf5] rounded-xl py-10 overflow-hidden'>
      <h1 className='text-8xl font-bold font-tf text-red-600'>404</h1>
      <p className='text-4xl font-serif font-bold text-blue-500 py-3'>Page not found</p>
      <Link to={'/'} className='pt-4'>
         <button className='px-3 py-4 bg-gray-600 text-gray-200 rounded-xl font-serif text-lg font-bold hover:bg-gray-700 shadow-hovershd focus:shadow-shd'>Homepage</button>
      </Link>
    </div>
  )
}

export default NotFound
