import React, { useRef, useEffect } from 'react';
import useCountdown from '../../hooks/useCountdown';
import LoaderButton from '../loaders/LoaderButton';
import { motion } from 'framer-motion';
interface ComponentProps {


    handleSubmit: (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>,
        code: string,
    ) => void,


    handleAccountChange: (
        e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void,
    style: string,
    isLoading: boolean,
    setStyle: React.Dispatch<React.SetStateAction<string>>,
}


const CodeGrabber = (
    {
        handleSubmit,
        handleAccountChange,
        style,
        setStyle,
        isLoading
    }: ComponentProps
) => {
    const codesDivRef = useRef<HTMLDivElement>(null);
    const [remainingTime,] = useCountdown(300);


    useEffect(() => {
        if (style === "default") {
            codesDivRef.current.classList.remove("validCode-LoginPage");
            codesDivRef.current.classList.remove("invalidCode-LoginPage");
            codesDivRef.current.classList.add("defaultCode-LoginPage");
            return;
        }
        if (style === "valid") {
            codesDivRef.current.classList.remove("defaultCode-LoginPage");
            codesDivRef.current.classList.add("validCode-LoginPage");
            return;
        }
        if (style === "invalid") {
            codesDivRef.current.classList.remove("defaultCode-LoginPage");
            codesDivRef.current.classList.add("invalidCode-LoginPage");
            return;
        }
    }, [style]);


    // Exit registration when code expires
    useEffect(() => {
        if (remainingTime !== 0) return;
        handleAccountChange();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remainingTime]);

    const CountdownTimer = () => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60 < 10 ? `0${remainingTime % 60}` : remainingTime % 60;
        return (
            <React.Fragment>
                {`${minutes || "00"}:${seconds}`}
            </React.Fragment>
        );
    }

    const focusNextChild = (
        e: React.FormEvent<HTMLDivElement>
    ) => {
        // @ts-ignore
        if (parseInt(e.target.id) + 1 > 5) {
            return;
        }
        try {
            // @ts-ignore
            e.currentTarget?.children[parseInt(e.target.id) + 1].focus();
        } catch (error) {
            console.error("Cannot focus input field");
            console.warn("Elements were manualy removed\nThis could lead into page errors!");
        }
    }

    const focusPreviousChild = (
        e: React.KeyboardEvent<HTMLDivElement>
    ) => {
        if (e.key === "Backspace") {
            // @ts-ignore
            if (parseInt(e.target.id) - 1 < 0) {
                return;
            }
            try {
                // @ts-ignore
                e.currentTarget?.children[parseInt(e.target.id)].value = null;
                // @ts-ignore
                e.currentTarget?.children[parseInt(e.target.id) - 1].focus();
            } catch (error) {
                console.log(error)
                console.error("Cannot focus input field");
                console.warn("Elements were manualy removed\nThis could lead into page errors!");
            }
        }
    }

    const valueCheck = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        // Enter check
        if (e.key === "Enter") {
            handleSubmit(e, collectCodes());
            return
        }
        // length check
        if (e.currentTarget.value.toString().length == 1) {
            if (parseInt(e.key.toString()) === NaN) {
                e.preventDefault();
                return;
            }
            e.currentTarget.value = "";
        }
        if (parseInt(e.key.toString()) === NaN) {
            e.preventDefault();
        }
    }
    const collectCodes = () => {
        let arrayCodes = [];
        for (let index = 0; index < 6; index++) {
            // Ignoring due bcs. value exists
            // @ts-ignore
            arrayCodes[index] = codesDivRef.current?.children[index].value;
        }
        return arrayCodes.join("");
    }

    const handlePaste = (
        e: React.ClipboardEvent<HTMLDivElement>
    ) => {
        const pasteData = e.clipboardData.getData("text");
        e.preventDefault()
        if (pasteData.length < 6) return;
        for (let child = 0; child < 6; child++) {
            if (!/\d/.test(pasteData[child])) continue;
            // @ts-ignore
            e.currentTarget.children[child].value = pasteData[child];
        }
    }

    return (
        <motion.div
            initial={{ x: 480 }}
            animate={{ x: 0 }}
            exit={{ x: -480 }}
            className='flex flex-col justify-center items-center'
        >
            <p className='text-lg w-full text-left mb-2 font-medium'>Zadejte kód z Emailu:</p>
            <div
                className='flex gap-2 defaultCode-LoginPage'
                ref={codesDivRef}
                onInput={(e) => {
                    focusNextChild(e);
                    setStyle("default");
                }}
                onKeyDown={(e) => focusPreviousChild(e)}
                onPaste={(e) => handlePaste(e)}
            >
                <input id="0" onKeyPress={(e) => valueCheck(e)} type="tel" autoCorrect='off' className='duration-300 w-12 h-12 border-2 text-center text-2xl font-bold rounded-xl outline-none appearance-none' />
                <input id="1" onKeyPress={(e) => valueCheck(e)} type="tel" autoCorrect='off' className='duration-300 w-12 h-12 border-2 text-center text-2xl font-bold rounded-xl outline-none appearance-none' />
                <input id="2" onKeyPress={(e) => valueCheck(e)} type="tel" autoCorrect='off' className='duration-300 w-12 h-12 border-2 text-center text-2xl font-bold rounded-xl outline-none appearance-none' />
                <input id="3" onKeyPress={(e) => valueCheck(e)} type="tel" autoCorrect='off' className='duration-300 w-12 h-12 border-2 text-center text-2xl font-bold rounded-xl outline-none appearance-none' />
                <input id="4" onKeyPress={(e) => valueCheck(e)} type="tel" autoCorrect='off' className='duration-300 w-12 h-12 border-2 text-center text-2xl font-bold rounded-xl outline-none appearance-none' />
                <input id="5" onKeyPress={(e) => valueCheck(e)} type="tel" autoCorrect='off' className='duration-300 w-12 h-12 border-2 text-center text-2xl font-bold rounded-xl outline-none appearance-none' />
            </div>
            <p className='w-full text-right mr-3 mt-1 text-lg text-gray-800'><CountdownTimer /></p>
            <div className='flex items-center w-full justify-between px-5'>
                <button onClick={(e) => handleAccountChange(e)} className='border-4 border-violet-500 text-white rounded-full w-12 h-12 flex box-border pl-3 items-center hover:border-violet-600 duration-200'><BackArrow /></button>
                <button onClick={(e) => {
                    handleSubmit(e, collectCodes());
                }}>
                    <LoaderButton isLoading={isLoading}>Pokračovat</LoaderButton>
                </button>
            </div>
        </motion.div>
    );

};

const BackArrow = () => {
    return (
        <svg className='fill-violet-500 hover:fill-violet-600 duration-200' width="14" height="24" viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.93934 10.9393C0.353554 11.5251 0.353553 12.4749 0.939339 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92894 13.1924 1.97919 12.6066 1.3934C12.0208 0.807615 11.0711 0.807615 10.4853 1.3934L0.93934 10.9393ZM3 10.5L2 10.5L2 13.5L3 13.5L3 10.5Z" />
        </svg>
    )
}

export default CodeGrabber;
