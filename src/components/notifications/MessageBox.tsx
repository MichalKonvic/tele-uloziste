import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
const MessageBox = ({ handlePrimary, handleSecondary, message }: {
    handlePrimary: () => void,
    handleSecondary: () => void,
    message: {
        title: string,
        description: string,
        primary: string,
        secondary: string
    }
}) => {
    return (
        <AnimatePresence>
            <div className='z-50 absolute top-0 left-0 flex w-screen h-screen items-center justify-center'>
                <motion.div
                    key="msgBOX"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.5 }}
                    className='flex flex-col items-center justify-between w-[22rem] bg-gray-300 border border-gray-400 shadow-2xl rounded-lg'
                >
                    <div className='px-10 pt-8 w-full'>
                        <h1 className='font-bold text-4xl text-gray-700 w-full text-center'>{message?.title}</h1>
                        <p className='mt-2 text-lg'>{message?.description}</p>
                    </div>
                    <div className='flex gap-8 my-10'>
                        <button onClick={() => handlePrimary()} className='bg-purple-500 text-white py-2 w-36 text-xl font-medium rounded-lg hover:bg-purple-600 duration-200'>{message?.primary}</button>
                        <button onClick={() => handleSecondary()} className='border-purple-500 text-purple-500 border-2 w-36 py-2 text-xl font-semibold rounded-lg hover:bg-purple-300 hover:border-purple-300 duration-200'>{message?.secondary}</button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default MessageBox