import React, { Dispatch, SetStateAction, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
type fileT = {
    type: "FOLDER" | "FILE",
    Name: string,
    Description: string,
    fileUrl?: string
}

const FolderIcon = () => {
    return (
        <svg width="81" height="70" viewBox="0 0 81 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.588226" width="55" height="70" rx="5" fill="#6C2CF2" />
            <rect x="0.588226" y="16.044" width="80" height="53.8462" rx="5" fill="#9F76F7" />
        </svg>
    )
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

const TypeSelection = ({
    file,
    setFile,
    setSection,
    showMenu
}: {
    file: fileT,
    setFile: Dispatch<SetStateAction<fileT>>,
    setSection: React.Dispatch<React.SetStateAction<string>>,
    showMenu: Dispatch<SetStateAction<boolean>>
}) => {
    const [outline, setoutline] = useState(file.type);
    const handleTypeChange = (fileType: "FOLDER" | "FILE") => {
        const fileCopy = file;
        fileCopy.type = fileType;
        setoutline(fileType);
        setFile(fileCopy);
    }
    return (
        <motion.div
            key="SELECT_TYPE"
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            exit={{ x: -200 }}
            transition={{ delay: 0.5 }}
            className="flex items-center flex-col w-full h-full p-2"
        >
            <h1 className='text-3xl font-bold text-gray-700'>Nový soubor</h1>
            <h2 className='mt-1 mb-2'>Vyber typ souboru</h2>
            <div className='flex gap-5'>
                <div
                    onClick={() => handleTypeChange("FOLDER")}
                    className={`flex flex-col w-32 h-32 bg-gray-200 duration-200 rounded-lg cursor-pointer hover:shadow-xl flexCenter outline-blue-400 outline-2 ${outline === "FOLDER" ? "outline shadow-xl" : "shadow-md"}`}
                >
                    <FolderIcon />
                </div>
                <div
                    onClick={() => handleTypeChange("FILE")}
                    className={`w-32 h-32 bg-gray-200 duration-200 rounded-lg cursor-pointer hover:shadow-xl flexCenter outline-blue-400 outline-2 ${outline === "FILE" ? "outline shadow-xl" : "shadow-md"}`}
                >
                    <FileIcon />
                </div>
            </div>
            <div className='flex gap-5 mt-5'>
                <button onClick={() => setSection("CREATE")} className='bg-purple-500 text-white py-2 w-36 text-xl font-medium rounded-lg hover:bg-purple-600 duration-200'>Vytvořit</button>
                <button onClick={() => showMenu(false)} className='border-purple-500 text-purple-500 border-2 w-36 py-2 text-xl font-semibold rounded-lg hover:bg-purple-300 hover:border-purple-300 duration-200'>Zrušit</button>
            </div>
        </motion.div>
    );
}

const handleFolderCreation = (file: fileT, showMenu: Dispatch<SetStateAction<boolean>>) => {
    // TODO API communication
    console.log(file)
    showMenu(false);
}
const handleFileCreation = (file: fileT, showMenu: Dispatch<SetStateAction<boolean>>) => {
    // TODO API communication
    console.log(file)
    showMenu(false);
}

const CreationSelection = ({
    file,
    setFile,
    setSection,
    showMenu
}: {
    file: fileT,
    setFile: Dispatch<SetStateAction<fileT>>,
    setSection: React.Dispatch<React.SetStateAction<string>>,
    showMenu: Dispatch<SetStateAction<boolean>>
}) => {
    const fileNameRef = useRef(null);
    const fileDescriptionRef = useRef(null);

    const handleCreation = () => {
        let fileDataCopy: fileT = file;
        //@ts-ignore
        const fileName: string = fileNameRef.current.value || 'UNTITLED';
        //@ts-ignore
        const fileDescription: string = fileNameRef.current.value || ' ';
        fileDataCopy.Name = fileName.substring(0, 32);
        fileDataCopy.Description = fileDescription.substring(0, 32);
        setFile(fileDataCopy);
        if (file.type === "FILE") {
            setSection("FILE_LINK");
            return;
        }
        setSection("FOLDER_CREATE");
    }
    return (
        <motion.div
            key="CREATE_NAME"
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            exit={{ x: -200 }}
            transition={{ delay: 0.5 }}
            className="flex items-center flex-col w-full h-full p-2"
        >
            {file.type === "FILE" ?
                <h1 className='text-3xl font-bold text-gray-700 mt-2'>Nový soubor</h1>
                : <h1 className='text-3xl font-bold text-gray-700 mt-2'>Nová složka</h1>
            }
            <div className='flexCenter flex-col h-40 gap-3'>
                <input type="text" name="fileName" id="FILE_NAME"
                    ref={fileNameRef}
                    placeholder={file.type === "FILE" ? "Název souboru" : "Název složky"}
                    className='w-60 h-10 bg-gray-200 rounded-lg px-3 outline-none text-lg text-gray-700 font-medium' maxLength={32} />
                <input type="text" name="fileName" id="FILE_NAME"
                    ref={fileDescriptionRef}
                    placeholder="Popis"
                    className='w-60 h-10 bg-gray-200 rounded-lg px-3 outline-none text-md text-gray-700 font-medium' maxLength={32} />
            </div>
            <div className='flex gap-5'>
                <button onClick={() => handleCreation()} className='bg-purple-500 text-white py-2 w-36 text-xl font-medium rounded-lg hover:bg-purple-600 duration-200'>Vytvořit</button>
                <button onClick={() => showMenu(false)} className='border-purple-500 text-purple-500 border-2 w-36 py-2 text-xl font-semibold rounded-lg hover:bg-purple-300 hover:border-purple-300 duration-200'>Zrušit</button>
            </div>
        </motion.div>
    );
}

const FileURLSection = ({
    file,
    setFile,
    setSection,
    showMenu
}: {
    file: fileT,
    setFile: Dispatch<SetStateAction<fileT>>,
    setSection: React.Dispatch<React.SetStateAction<string>>,
    showMenu: Dispatch<SetStateAction<boolean>>
}) => {
    const fileNameRef = useRef(null);
    const fileDescriptionRef = useRef(null);

    const handleURLEnter = () => {
        //TODO add logic
    }
    return (
        <motion.div
            key="CREATE_NAME"
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            exit={{ x: -200 }}
            transition={{ delay: 0.5 }}
            className="flex items-center flex-col w-full h-full p-2"
        >
            <h1 className='text-3xl font-bold text-gray-700 mt-5'>Odkaz na soubor</h1>
            <div className='flexCenter flex-col mb-5 h-32 gap-1'>
                <input type="url" name="fileURL" id="FILE_URL"
                    ref={fileNameRef}
                    placeholder="Odkaz na soubor"
                    className='w-72 h-10 bg-gray-200 rounded-lg px-3 outline-none text-lg text-gray-700 font-medium' />
                <Link href={"/guids/createURL"} replace={false} passHref>
                    <a target="_blank" className='text-gray-600 pl-2 cursor-pointer duration-150 hover:underline hover:text-gray-800 w-full'>
                        Jak vytvořit odkaz?
                    </a>
                </Link>
            </div>
            <div className='flex gap-5'>
                <button onClick={() => handleURLEnter()} className='bg-purple-500 text-white py-2 w-36 text-xl font-medium rounded-lg hover:bg-purple-600 duration-200'>Vytvořit</button>
                <button onClick={() => showMenu(false)} className='border-purple-500 text-purple-500 border-2 w-36 py-2 text-xl font-semibold rounded-lg hover:bg-purple-300 hover:border-purple-300 duration-200'>Zrušit</button>
            </div>
        </motion.div>
    );
}

const CreateFileMenu = ({ showMenu }: { showMenu: Dispatch<SetStateAction<boolean>> }) => {
    const [section, setSection] = useState("SELECT");
    const [file, setfile] = useState<fileT>({
        type: "FOLDER",
        Name: "",
        Description: "",
    });
    return <div className='w-screen h-[calc(100vh-3.5rem)] top-14 flexCenter left-0 z-10  absolute' onClick={(e) => e.currentTarget == e.target && showMenu(false)}>
        <AnimatePresence>
            <motion.div
                key="msgBOX"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5 }}
                className='w-[22rem] h-72 rounded-lg border shadow-2xl border-gray-300 bg-white overflow-hidden'>
                {section === "SELECT" && <TypeSelection file={file} setFile={setfile} setSection={setSection} showMenu={showMenu} />}
                {section === "CREATE" && <CreationSelection file={file} setFile={setfile} setSection={setSection} showMenu={showMenu} />}
                {section === "FILE_LINK" && <FileURLSection file={file} setFile={setfile} setSection={setSection} showMenu={showMenu} />}
                {section === "FOLDER_CREATE" && handleFolderCreation(file, showMenu)}
                {section === "FILE_CREATE" && handleFileCreation(file, showMenu)}
            </motion.div>
        </AnimatePresence>
    </div>;

}

export default CreateFileMenu