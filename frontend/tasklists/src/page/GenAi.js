import { Button, TextInput } from 'flowbite-react'
import React from 'react'

const GenAi = () => {
    const customTheme = {
        field: {
          colors: {
            gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 text-2xl",
          },
          input: {
            sizes: {
              lg: "sm:text-lg p-4 font-tf rounded-b-2xl dark:bg-gray-800 dark:text-gray-200 h-16",
            },
            withAddon: {
              off: "rounded-b-2xl",
            },
          },
        },
      };
  return (
    <>
    <div className='screen max-w-5xl min-w-64 bg-gray-800 text-slate-200 h-[500px] mx-auto rounded-t-3xl shadow-shd p-4 mt-4 space-y-3 overflow-auto dark:bg-black dark:text-gray-400'>
       <div className="info space-y-2">
        <h1 className='text-2xl font-tf font-semibold'>GENAI built on Gemini</h1>
        <p className='text-lg font-serif'>Ask your questions, problems, and ideas to GENAI !</p>
       </div>
       <div className="qna space-y-2">
        <h3 className='text-xl font-mono'>What is Task Manager?</h3>
        <p className='font-serif text-lg ' >A task manager app where you can create your tasks or todo-lists and manage safely.<span className='font-bold text-2xl animate-pulse text-gray-300 transition-all duration-150'>|</span></p>
       </div>
    </div>
    <div className="promptBox max-w-5xl min-w-64 mx-auto rounded-b-3xl relative">
        <TextInput theme={customTheme} color={customTheme} placeholder='e.g. Write a poem on nature?' sizing="lg" />
        <Button className='absolute top-3 right-3'>GEN</Button>
    </div>
    </>
  )
}

export default GenAi
