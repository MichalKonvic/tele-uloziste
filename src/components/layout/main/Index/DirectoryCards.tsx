import React from 'react'
import { directoryI, cardDataI } from '../../../../../interfaces/DirCards';
import DirCard from './DirCard';
const DirectoryCards = ({ directoryData }: {
    directoryData: directoryI
}) => {
    return <div className='w-screen h-full grid cardGrid p-5 self-center gap-5 overflow-x-hidden overflow-y-auto justify-items-center'>
        {directoryData.children.map((child) => {
            return <DirCard key={child.id} cardData={child} />
        })}
        <AddButtonCard />
    </div>
}

const AddButtonCard = () => {
    return <div className='border-dashed border-4 flexCenter cursor-pointer border-blue-500 w-40 h-40 rounded-xl p-3 flex flex-col duration-200 hover:shadow-2xl' title='Nový soubor'>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="13.5" width="30" height="3" rx="1.5" fill="#4F7AE9" />
            <rect x="13.5" y="30" width="30" height="3" rx="1.5" transform="rotate(-90 13.5 30)" fill="#4F7AE9" />
        </svg>
    </div>

}

export default DirectoryCards;