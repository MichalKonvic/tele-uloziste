import React, { useRef, useEffect } from 'react';

interface componentPropsI {
    children: JSX.Element | any,
    isLoading: boolean
}

const LoaderButton = ({ children, isLoading }: componentPropsI) => {
    const buttonRef = useRef(null);
    useEffect(() => {
        if (!isLoading) {
            buttonRef.current.classList.add("hover:bg-violet-600");
            buttonRef.current.classList.add("cursor-pointer");
            buttonRef.current.classList.remove("cursor-progress");
        }
        if (isLoading) {
            buttonRef.current.classList.remove("hover:bg-violet-600");
            buttonRef.current.classList.remove("cursor-pointer");
            buttonRef.current.classList.add("cursor-progress");
        }
    }, [isLoading]);

    return (<span key="submitButton" ref={buttonRef} disabled={isLoading} className='flex items-center gap-2 text-2xl py-2 cursor-pointer px-3 bg-violet-500 text-white rounded-lg duration-300 hover:bg-violet-600'>
        {isLoading
            ? <div className='animate-spin w-5 h-5 rounded-full border-4 border-violet-400 border-t-gray-100'></div>
            : null
        }
        {isLoading
            ? "Načítání..."
            : children
        }
    </span>);
};

export default LoaderButton;
