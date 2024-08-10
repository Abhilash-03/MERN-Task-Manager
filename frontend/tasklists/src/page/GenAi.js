import { Alert, Button, TextInput } from 'flowbite-react'
import api from '../axios/axios';
import { useState } from 'react';
import { HiInformationCircle, HiSparkles } from 'react-icons/hi';
import { logoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const customTheme = {
    field: {
      colors: {
        gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 text-2xl",
      },
      input: {
        sizes: {
          lg: "sm:text-lg p-4 font-tf focus:ring-0 dark:bg-gray-800 dark:text-gray-200 h-16 border-none",
        },
        withAddon: {
          off: "rounded-3xl",
        },
      },
    },
  };

const GenAi = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedAnswer, setGeneratedAnswer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState(null);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const handleGeneratingData = async() => {
        setQuestion(prompt);
         try {
            setLoading(true);
            const response = await api.post(`/api/v1/ai/genai`, {prompt});
            const textWithBreaks = response.data.replace(/\n/g, '<br />');
           setGeneratedAnswer(textWithBreaks);
         } catch (error) {
            console.log(error.response?.data);
            if(error.response?.status === 401) {
                dispatch(logoutSuccess());
              }
            setError(error.response?.data?.msg);
         } finally{
            setLoading(false);
         }
         setPrompt('');
    }
     
  return (
    <>
       {error &&  <Alert color="failure" icon={HiInformationCircle} className='font-semibold font-serif'>
    <span className="font-semibold font-tf">Error: </span> {error} Please sign-in or sing-up.
  </Alert>}
    <div className='screen max-w-5xl min-w-64 bg-gray-800 text-slate-200 h-[80vh] lg:h-[580px] mx-auto rounded-t-3xl shadow-shd p-4 mt-4 space-y-3 overflow-auto dark:bg-black dark:text-gray-400'>
       <div className="info space-y-2">
        <h1 className='text-2xl font-tf font-semibold'>GENAI built on Gemini</h1>
        <h2 className='md:text-5xl text-3xl font-tf font-bold text-transparent bg-clip-text bg-gradient-to-b from-blue-600 to-pink-700 inline-flex py-3'><span className='text-pink-500'>{<HiSparkles className='h-8 w-8 '/>}</span> Hello, {currentUser ? currentUser.username : 'there'}!</h2>
        <p className='text-lg font-serif'>Ask your questions, problems, and ideas to GENAI !</p>
       </div>
       <div className="qna space-y-2">
        {
            !generatedAnswer && (
                <>
                <h3 className='text-xl font-mono'>{question ? question : "What is Task Manager?"}</h3>
                <p className='font-serif text-lg '>{loading ? "Generating..." : "A task manager app where you can create your tasks or todo-lists and manage safely."}<span className='font-bold text-2xl animate-pulse text-gray-300 transition-all duration-150'>|</span></p>
                </>
            )
        }

        {
            generatedAnswer && (
                <>
                <h3 className='text-xl text-gray-100 font-mono'>{question}</h3>
                <p className='font-serif text-xl transition-all duration-300'> {loading ? 'Generating....' : <span dangerouslySetInnerHTML={{__html: generatedAnswer}}></span>}<span className='font-bold text-2xl animate-pulse text-gray-300 transition-all duration-150'>|</span></p>
                </>
            )
        }
       
       </div>
    </div>
    <div className="promptBox max-w-5xl min-w-64 mx-auto rounded-b-3xl relative bg-white dark:bg-gray-800">
        <TextInput theme={customTheme} className='w-[84%] lg:w-[87%]' placeholder='e.g. Write a poem on nature?' sizing="lg" value={prompt} onChange={(e) => setPrompt(e.target.value)} required/>
        <Button className='absolute top-2 right-3 lg:w-[10%] w-[15%] h-12' disabled={prompt.length < 3 ? true : false} onClick={handleGeneratingData}>GEN</Button>
    </div>
    </>
  )
}

export default GenAi
