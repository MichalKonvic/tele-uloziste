import React, {  useRef } from 'react';

interface ComponentProps{
    handleSubmit: (
        e:React.MouseEvent<HTMLInputElement,MouseEvent>,
        code: string,
        codesDivRef: React.MutableRefObject<HTMLDivElement|null>
    ) => void,
    handleAccountChange: (
        e:React.MouseEvent<HTMLButtonElement,MouseEvent>
    ) => void,
    remainingTime: number
}


const CodeGrabber = (
    {
        handleSubmit,
        handleAccountChange,
    }:ComponentProps
) => {
    const codesDivRef = useRef<HTMLDivElement>(null);
    const focusNextChild = (
        e: React.FormEvent<HTMLDivElement>
    ) => {
        // @ts-ignore
        if(parseInt(e.target.id)+1 > 5){
            return;
        }
        try {
            // @ts-ignore
            e.currentTarget?.children[parseInt(e.target.id)+1].focus();
        } catch (error) {
            console.error("Cannot focus input field");
            console.warn("Elements were manualy removed\nThis could lead into page errors!");
        }
    }

    const focusPreviousChild = (
        e:React.KeyboardEvent<HTMLDivElement>
    ) => {
        if(e.key === "Backspace"){
            // @ts-ignore
            if(parseInt(e.target.id)-1 < 0){
                return;
            }
            try {
                // @ts-ignore
                e.currentTarget?.children[parseInt(e.target.id)].value = null;
                // @ts-ignore
                e.currentTarget?.children[parseInt(e.target.id)-1].focus();
            } catch (error) {
                console.log(error)
                console.error("Cannot focus input field");
                console.warn("Elements were manualy removed\nThis could lead into page errors!");
            }
        }
    }

    const valueCheck = (
        e:React.KeyboardEvent<HTMLInputElement>
    ) => {
        // length check
        if(e.currentTarget.value.toString().length == 1){
            if(!parseInt(e.key.toString())){
                e.preventDefault();
                return;
            }
            e.currentTarget.value = "";
        }
        // key check
        if(!parseInt(e.key.toString())){
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

    return (
        <div
            className='flex flex-col justify-center items-center'
        >
            <p className='text-lg w-full text-left mb-2 font-medium'>Zadejte kód z Emailu</p>
            <div
                className='flex gap-2 defaultCode-LoginPage'
                ref={codesDivRef}
                onInput={(e) => {
                    focusNextChild(e);
                    if(e.currentTarget.classList.contains("invalidCode-LoginPage"))e.currentTarget.classList.remove("invalidCode-LoginPage");
                    if(!e.currentTarget.classList.contains("defaultCode-LoginPage"))e.currentTarget.classList.add("defaultCode-LoginPage")
                }}
                onKeyDown={(e) => focusPreviousChild(e)}
            >
                <input id="0" onKeyPress={(e) => valueCheck(e)} type="tel" autoCorrect='off' className='duration-300 w-12 h-12 border-2 text-center text-2xl font-bold rounded-xl outline-none appearance-none' />
                <input id="1" onKeyPress={(e) => valueCheck(e)} type="tel" autoCorrect='off' className='duration-300 w-12 h-12 border-2 text-center text-2xl font-bold rounded-xl outline-none appearance-none' />
                <input id="2" onKeyPress={(e) => valueCheck(e)} type="tel" autoCorrect='off' className='duration-300 w-12 h-12 border-2 text-center text-2xl font-bold rounded-xl outline-none appearance-none' />
                <input id="3" onKeyPress={(e) => valueCheck(e)} type="tel" autoCorrect='off' className='duration-300 w-12 h-12 border-2 text-center text-2xl font-bold rounded-xl outline-none appearance-none' />
                <input id="4" onKeyPress={(e) => valueCheck(e)} type="tel" autoCorrect='off' className='duration-300 w-12 h-12 border-2 text-center text-2xl font-bold rounded-xl outline-none appearance-none' />
                <input id="5" onKeyPress={(e) => valueCheck(e)} type="tel" autoCorrect='off' className='duration-300 w-12 h-12 border-2 text-center text-2xl font-bold rounded-xl outline-none appearance-none' />
            </div>
            <p className='w-full text-right mr-3 mt-1 text-lg text-gray-800'>4:48</p>
            <div className='flex items-center w-full justify-between px-5'>
                <button onClick={(e) => handleAccountChange(e)} className='border-4 border-violet-500 text-white rounded-full w-12 h-12 flex box-border pl-3 items-center hover:border-violet-600 duration-200'><BackArrow/></button>
                <input type="submit" onClick={(e) => {
                    handleSubmit(e,collectCodes(), codesDivRef);
                }} value="Pokračovat" className='mt-2 text-2xl py-2 cursor-pointer px-5 h-12 bg-violet-500 text-white rounded-lg duration-300 hover:bg-violet-600' />
            </div>
        </div>
    );

};

const BackArrow = () => {
    return(
        <svg className='fill-violet-500 hover:fill-violet-600 duration-200' width="14" height="24" viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.93934 10.9393C0.353554 11.5251 0.353553 12.4749 0.939339 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92894 13.1924 1.97919 12.6066 1.3934C12.0208 0.807615 11.0711 0.807615 10.4853 1.3934L0.93934 10.9393ZM3 10.5L2 10.5L2 13.5L3 13.5L3 10.5Z"/>
        </svg>
    )
}

export default CodeGrabber;
