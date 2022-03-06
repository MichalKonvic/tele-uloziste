import React from 'react'
import Link from 'next/link'
import { cardDataI } from '../../../../../../interfaces/DirCards'
const FileCard = ({ fileData }: { fileData: cardDataI }) => {
    return <Link href={fileData.hrefURL} passHref>
        <div
            className='w-40 h-40 bg-white shadow-xl rounded-lg p-3 flex flex-col hover:shadow-2xl duration-200 cursor-pointer'
        >
            <h1 className='text-2xl text-gray-800 font-semibold w-28 text-ellipsis overflow-hidden whitespace-nowrap' title={fileData.Title}>{fileData.Title}</h1>
            <p className='w-36 mb-5 mt-1 overflow-hidden whitespace-nowrap text-ellipsis' title={fileData.Description} >{fileData.Description}</p>
            <div className='w-8 h-8 overflow-clip rounded-full flexCenter'>
                <img src={fileData.formatIconUrl} width="80px" className='max-w-none' alt="" />
            </div>
            <p className='text-gray-500 font-light text-ellipsis overflow-hidden whitespace-nowrap' title={fileData.filename}>{fileData.filename}</p>
        </div>
    </Link>
}

export default FileCard