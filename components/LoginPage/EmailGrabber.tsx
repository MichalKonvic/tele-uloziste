import React, { useRef, useEffect } from 'react';
import LoaderButton from '../../components/loaders/LoaderButton'
import { motion } from 'framer-motion';
interface ComponentProps {
    handleSubmit: (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => void,
    style: string,
    setStyle: React.Dispatch<React.SetStateAction<string>>,
    isLoading: boolean
}


const EmailGrabber = (
    { handleSubmit, isLoading, style, setStyle }: ComponentProps
) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (style === "default") {
            inputRef.current.classList.remove("text-red-400");
            inputRef.current.classList.remove("text-green-400");
            return;
        }
        if (style === "valid") {
            inputRef.current.classList.add("text-green-400");
            return;
        }
        if (style === "invalid") {
            inputRef.current.classList.add("text-red-400");
            return;
        }
    }, [style]);

    return (
        <motion.div
            initial={{ x: 480 }}
            animate={{ x: 0 }}
            exit={{ x: -480 }}
            className='flex flex-col justify-center items-center'
        >
            <div className='grid'>
                <input ref={inputRef} onInput={() => setStyle("default")} autoComplete="off" placeholder='jméno.příjmení' type="text" id='emailName' className='bg-white text-center w-50 h-12 text-3xl outline-none row-start-1 row-end-2' />
                <p className='row-start-2 row-end-3 col-start-1 col-end-6 text-center text-lg h-12 text-blue-500 font-medium'>@teleinformatika.eu</p>
            </div>
            <button onClick={(e) => handleSubmit(e)}>
                <LoaderButton isLoading={isLoading}>Pokračovat</LoaderButton>
            </button>
        </motion.div>
    );

};


export default EmailGrabber;
