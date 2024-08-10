import { Button } from 'flowbite-react'
import React from 'react'
import { HiSparkles } from 'react-icons/hi'

const AIButton = ({right, bottom}) => {
  return (
    <Button className={`fixed right-${right || 10} bottom-${bottom || 10} font-tf hidden md:block mx-2`}  outline color={'blue'} size={'lg'} pill>
        <HiSparkles className='text-pink-700 text-lg mr-2 h-5 w-5' />
      Ask GenAI?
    </Button>
  )
}

export default AIButton
