import React from 'react'
import { cardDataI, directoryI } from '../../../../../interfaces/DirCards'
import FileCard from './cards/FileCard'
import FolderCard from './cards/FolderCard'
const DirCard = ({ cardData }: {
    cardData: directoryI | cardDataI
}) => {
    // Folder card
    if (cardData.isDir) return <FolderCard folderData={cardData} />
    // File Card
    return <FileCard fileData={cardData} />;
}

export default DirCard;