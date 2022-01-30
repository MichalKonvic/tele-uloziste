import React, {  useRef } from 'react';

interface ComponentProps{
    handleSubmit: (
        e:React.MouseEvent<HTMLInputElement,MouseEvent>,
        inputRef: React.MutableRefObject<HTMLInputElement | null>
    ) => void,
    handleAccountChange: (
        e:React.MouseEvent<HTMLButtonElement,MouseEvent>
    ) => void
}


const PasswordGrabber = (
    {
        handleSubmit,
        handleAccountChange
    }:ComponentProps
) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const textColorCleanup = () => {
        if(inputRef.current?.classList.contains("text-red-400")) inputRef.current.classList.remove("text-red-400");
        if(inputRef.current?.classList.contains("text-green-400")) inputRef.current.classList.remove("text-green-400");
    }


    return (
        <div
            className='flex flex-col justify-center items-center'
        >
                <div className='grid'>
                    <input ref={inputRef} onInput={textColorCleanup} autoComplete="off" placeholder='jméno.příjmení' type="text" id='emailName' className='bg-white text-center w-50 h-12 text-3xl outline-none row-start-1 row-end-2'/>
                    <p className='row-start-2 row-end-3 col-start-1 col-end-6 text-center text-lg h-12 text-blue-500 font-medium'>@teleinformatika.eu</p>
                </div>
                <input type="submit" onClick={(e) => handleSubmit(e,inputRef)} value="Pokračovat" className='mt-2 text-2xl py-2 cursor-pointer px-5 bg-violet-500 text-white rounded-lg duration-300 hover:bg-violet-600' />
        </div>
    );

};


export default PasswordGrabber;
