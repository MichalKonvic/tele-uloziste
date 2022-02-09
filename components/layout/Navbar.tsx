import React, { useState } from 'react'
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
const Navbar = () => {
    const [openProfileMenu, setopenProfileMenu] = useState(false)
    return (
        <div className='flex h-14 w-screen bg-white justify-between px-2 items-center'>
            <div className='flex items-center gap-2 overflow-hidden'>
                <Image src="/favicon.svg" width={40} height={40} alt="Logo" className='z-10' />
                <h1
                    className='text-xl font-semibold text-gray-700'>Tele Cloud</h1>
            </div>
            <AnimatePresence exitBeforeEnter>
                <motion.div
                    layout
                    className='p-1 rounded-md flex items-center justify-between duration-200 transition-all overflow-hidden'
                    animate={openProfileMenu ? { width: "9rem", backgroundColor: "rgb(209 213 219)" } : { width: "3.5rem", backgroundColor: "" }}
                >
                    {
                        openProfileMenu ?
                            <motion.div>
                                <motion.div
                                    layout className='w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-400 rounded-md duration-200'
                                    onClick={() => setopenProfileMenu(!openProfileMenu)}
                                >
                                    <CloseArrow />
                                </motion.div>
                            </motion.div>
                            : <motion.div layout className='p-1 w-12 h-12 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-300 duration-200'
                                onClick={() => setopenProfileMenu(!openProfileMenu)}
                            >
                                <div className='w-10 h-10 rounded-full border-2 border-violet-500 bg-white flex items-center justify-center cursor-pointer'>
                                    <UserIcon />
                                </div>
                            </motion.div>
                    }
                    {openProfileMenu && <MenuItems />}
                </motion.div>
            </AnimatePresence>
        </div >
    )
}

const CloseArrow = () => {
    return (
        <svg width="30" height="25" viewBox="0 0 59 195" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 16L44 97.5L16 179" stroke="#5338F8" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const MenuItems = () => {
    return (
        <div className='flex gap-2'>
            <div className='hover:bg-gray-400 duration-200 p-2 rounded-md cursor-pointer'
                onClick={() => console.log("Settings")}
            >
                <SettingsIcon />
            </div>
            <div className='hover:bg-gray-400 duration-200 p-2 rounded-md cursor-pointer'
                onClick={() => console.log("Logout")}
            >
                <LogoutIcon />
            </div>
        </div>
    );
}

const LogoutIcon = () => {
    return (
        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 17H2V2H7.5" stroke="#F55454" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 9.5H16.5M16.5 9.5L12 5M16.5 9.5L12 14" stroke="#F55454" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const SettingsIcon = () => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M9 20C8.44771 20 8 19.5523 8 19C8 17.8187 6.57181 17.2272 5.73653 18.0624L5.53553 18.2634C5.14501 18.654 4.51184 18.654 4.12132 18.2634L2.70711 16.8492C2.31658 16.4587 2.31658 15.8255 2.70711 15.435C3.97471 14.1674 3.07694 12 1.28428 12H1C0.447715 12 0 11.5523 0 11V9C0 8.44771 0.447715 8 1 8H1.68629C2.97245 8 3.61656 6.44498 2.70711 5.53553C2.31659 5.14501 2.31659 4.51184 2.70711 4.12132L4.12132 2.70711C4.51185 2.31658 5.14501 2.31658 5.53554 2.70711C6.44498 3.61655 8 2.97245 8 1.68629V1C8 0.447715 8.44771 0 9 0H11C11.5523 0 12 0.447715 12 1V1.28426C12 3.07693 14.1674 3.9747 15.435 2.70709C15.8256 2.31657 16.4587 2.31657 16.8492 2.70709L18.2635 4.12131C18.654 4.51183 18.654 5.14499 18.2635 5.53552L18.0624 5.73653C17.2272 6.57181 17.8187 8 19 8C19.5523 8 20 8.44771 20 9V11C20 11.5523 19.5523 12 19 12C17.4606 12 16.6896 13.8612 17.7782 14.9497L18.2635 15.435C18.654 15.8256 18.654 16.4587 18.2635 16.8492L16.8492 18.2635C16.4587 18.654 15.8256 18.654 15.435 18.2635L14.9497 17.7782C13.8612 16.6896 12 17.4606 12 19C12 19.5523 11.5523 20 11 20H9ZM10 15C12.7614 15 15 12.7614 15 10C15 7.23858 12.7614 5 10 5C7.23858 5 5 7.23858 5 10C5 12.7614 7.23858 15 10 15Z" fill="#515151" />
        </svg>
    );
}

const UserIcon = () => {
    return (
        <svg width="30" height="30" viewBox="0 0 610 749" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="305" cy="200" r="200" fill="#6369F5" />
            <ellipse cx="305" cy="584.5" rx="305" ry="164.5" fill="#505050" />
        </svg>
    );
}

export default Navbar