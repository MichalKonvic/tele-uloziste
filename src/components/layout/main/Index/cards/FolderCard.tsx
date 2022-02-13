import React from 'react'
import { cardDataI, directoryI } from '../../../../../../interfaces/DirCards'
const FolderCard = ({ folderData }: { folderData: directoryI }) => {
    return <div
        className='w-40 h-40 bg-white shadow-xl rounded-lg p-3 flex flex-col justify-center gap-1 items-center hover:gap-3 hover:shadow-2xl duration-200 cursor-pointer'
    >
        <div className='shadow-2xl'>
            <FolderIcon />
        </div>
        <h1 className=' text-2xl font-bold text-gray-700'>{folderData?.Title}</h1>
    </div>
}


const FolderIcon = () => {
    return (
        <svg width="81" height="70" viewBox="0 0 81 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.588226" width="55" height="70" rx="5" fill="#6C2CF2" />
            <rect x="0.588226" y="16.044" width="80" height="53.8462" rx="5" fill="#9F76F7" />
        </svg>
    );
}

export default FolderCard