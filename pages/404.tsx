import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const notFound = () => {
    return (
        <div className='flexCenter w-screen h-screen flex-col'>
            <div className='flexCenter'>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className='border-4 border-red-500 px-4 py-2 rounded-xl flexCenter overflow-hidden'>
                    <motion.div
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 1 }}
                        className=' text-7xl font-bold text-gray-700 animate-pulse'>404</motion.div>
                </motion.div>
                <hr className='h-14 w-px mx-5 bg-black' />
                <div className='text-xl'>Stránka nenalezena</div>
            </div>
            <div className='flex gap-5'>
                <Link href={"/"} passHref>
                    <button className='mt-10 w-40 h-14 bg-purple-500 rounded-lg text-2xl text-white duration-200 hover:bg-purple-400'>Domů</button>
                </Link>
                <Link href={"/report"} passHref>
                    <button className='mt-10 w-40 h-14 border-2 border-purple-400 rounded-lg text-2xl text-gray-700 duration-200 hover:bg-purple-400'>Nahlásit</button>
                </Link>
            </div>
        </div>
    )
}

export default notFound