import React from 'react'
import Link from 'next/link'
import { fileI } from '../../../../../../interfaces/DirCards'
const FileCard = ({ fileData }: { fileData: fileI }) => {
    return <Link href={"/files/" + fileData._id} passHref replace>
        <div
            title={fileData.description}
            className='w-40 h-40 bg-white shadow-xl rounded-lg flex flex-col hover:gap-3 gap-1 justify-center items-center hover:shadow-2xl duration-200 cursor-pointer'
        >
            <div className='h-20 flexCenter'>
                <FileIcon />
            </div>
            <h1 className='text-center text-ellipsis w-36 truncate text-2xl font-bold text-gray-700'>{fileData.name}</h1>
        </div>
    </Link>
}
const FileIcon = () => {
    return (
        <svg className='scale-50' width="150" height="177" viewBox="0 0 150 177" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37258 0 0 5.37258 0 12V165C0 171.627 5.37258 177 12 177H138C144.627 177 150 171.627 150 165V36L114 0H12Z" fill="#9F76F6" />
            <path d="M114 0L150 36H126C119.373 36 114 30.6274 114 24V0Z" fill="#6C2CF2" />
            <rect x="9" y="22" width="66" height="6" rx="2" fill="white" />
            <rect x="9" y="133" width="80" height="6" rx="2" fill="white" />
            <rect x="9" y="149" width="66" height="6" rx="2" fill="white" />
            <rect x="9" y="37" width="89" height="6" rx="2" fill="white" />
            <rect x="9" y="53" width="32" height="6" rx="2" fill="white" />
            <rect x="51" y="53" width="32" height="6" rx="2" fill="white" />
            <rect x="9" y="69" width="72" height="6" rx="2" fill="white" />
            <rect x="91" y="69" width="30" height="6" rx="2" fill="white" />
            <rect x="49" y="85" width="70" height="6" rx="2" fill="white" />
            <rect x="9" y="101" width="70" height="6" rx="2" fill="white" />
            <rect x="9" y="117" width="40" height="6" rx="2" fill="white" />
            <rect x="59" y="117" width="30" height="6" rx="2" fill="white" />
            <rect x="99" y="117" width="40" height="6" rx="2" fill="white" />
            <rect x="9" y="85" width="30" height="6" rx="2" fill="white" />
        </svg>
    )
}

export default FileCard