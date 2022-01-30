import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import { NextPage } from 'next';
import { motion, useAnimation } from 'framer-motion';
import EmailGrabber from '../components/LoginPage/EmailGrabber';
import PasswordGrabber from '../components/LoginPage/PasswordGrabber';

interface validationResponseI{
    statusCode: number,
    message: string
}
interface errorMessageI{
    message: string
}


const LoginPage:NextPage = () => {


    const [errorMessage, setErrorMessage] = useState("");
    const [formTitle, setFormTitle] = useState("Tele Cloud");
    const titleAnimation = useAnimation();
    const sectionAnimation = useAnimation();
    let userEmail:string|undefined = undefined;



    /**
     * Intial animations
     */
    useEffect(() => {
        titleAnimation.start({y:0});
        setTimeout(() => {
            sectionAnimation.start({x:0});
        }, 500.);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);



    /**
     * Account change handling function
     */
    const handleAccountChange = async (
        e:React.MouseEvent<HTMLButtonElement,MouseEvent>
    ) => {
        e.preventDefault();
        userEmail = undefined;
        setTimeout(() => {
            titleAnimation.start({y:-100,opacity:0});
            sectionAnimation.start({x:-480,opacity:0});
            setTimeout(() => {
                titleAnimation.start({y:100});
                sectionAnimation.start({x:480});
            }, 400);
            setTimeout(() => {
                sectionAnimation.start({opacity:1});
                titleAnimation.start({opacity:1});
            }, 600);
            setTimeout(() => {
                setFormTitle("Tele Cloud")
                titleAnimation.start({y:0});
                setFormSection(<EmailGrabber handleSubmit={handleEmailSubmit}/>);
                sectionAnimation.start({x:0});
            }, 1000);
        }, 100);
    }



    /**
     * Email handling
     * @param e reference to button
     * @param inputRef reference to form inputBox
     * @returns Nothing
     */
    const handleEmailSubmit = async (
            e : React.MouseEvent<HTMLInputElement,MouseEvent>,
            inputRef: React.MutableRefObject<HTMLInputElement | null>
    ) => {
        e.preventDefault();
        // Cleans last errorMessages
        setErrorMessage("");

        const validationResponse:validationResponseI = await (await fetch(`/api/users/check/${inputRef.current?.value}@teleinformatika.eu`, {
            method: 'GET'
        })).json();

        if(validationResponse.statusCode === 200){
            userEmail = inputRef.current?.value;
            // transition
            inputRef.current?.classList.add("text-green-400");
            setTimeout(() => {
                titleAnimation.start({y:-100,opacity:0});
                sectionAnimation.start({x:-480,opacity:0});
                setTimeout(() => {
                    titleAnimation.start({y:100});
                    sectionAnimation.start({x:480});
                }, 400);
                setTimeout(() => {
                    sectionAnimation.start({opacity:1});
                    titleAnimation.start({opacity:1});
                }, 600);
                setTimeout(() => {
                    setFormTitle("Heslo")
                    titleAnimation.start({y:0});
                    setFormSection(<PasswordGrabber  handleSubmit={handlePasswordSubmit} handleAccountChange={handleAccountChange} />);
                    sectionAnimation.start({x:0});
                }, 1000);
            }, 100);

            return;
        }

        if(validationResponse.statusCode === 404){
            // TODO continue to registration
            return;
        }
        // invalid style
        // @ts-ignore
        inputRef.current.classList.add("text-red-400");
        setErrorMessage(validationResponse.message);
    }


    /**
     * Password handling
     * @param e reference to button
     * @param inputRef reference to form inputBox
     * @returns Nothing
     */
    const handlePasswordSubmit = async (
        e : React.MouseEvent<HTMLInputElement,MouseEvent>,
        inputRef: React.MutableRefObject<HTMLInputElement | null>
    ) => {
    e.preventDefault();
    // Cleans last errorMessages
    setErrorMessage("");

    // TODO make call to account validation
    const validationResponse:validationResponseI = await (await fetch(`/api/users/check/${inputRef.current?.value}@teleinformatika.eu`, {
        method: 'GET'
    })).json();

    if(validationResponse.statusCode === 200){
        // valid style
        inputRef.current?.classList.add("text-green-400");
        // TODO continue to application
        return;
    }

    // invalid style
    inputRef.current.classList.add("text-red-400");
    setErrorMessage(validationResponse.message);
}

    // MUST be defined here due to usage of handleEmailSubmit before declaration
    const [formSection, setFormSection] = useState(<EmailGrabber handleSubmit={handleEmailSubmit}/>);




    return (
        <div className='h-screen w-screen flex justify-center items-center bg-slate-200'>
        <Head>
            <title>Tele Cloud</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.svg" />
        </Head>
            <form className='duration-400 flex items-center flex-col w-full h-full justify-center bg-white md:w-fit md:h-fit md:px-10 md:py-14 md:border md:border-gray-300 md:shadow-xl md:rounded-lg overflow-hidden'>
                <div className='flex items-center justify-center overflow-hidden'>
                    <motion.h1
                        initial={{y:200}}
                        animate={titleAnimation}
                        className='text-5xl font-bold text-gray-700 duration-200 ease-out'>{formTitle}</motion.h1>
                </div>
                <div className='mt-2 w-full mb-5 flex justify-center'>
                    <ErrorMessage message={errorMessage}/>
                </div>
                <motion.div
                    initial={{x:480}}
                    animate={sectionAnimation}
                    className='duration-300 ease-out'
                >
                    {formSection}
                </motion.div>
            </form>
        </div>
    );
};

const ErrorMessage = ({message}: errorMessageI) => {
    if(message === "") return null;
    return(
        <React.Fragment>
            <motion.p
                initial={{x: 50}}
                animate={{x: 0}}
                exit={{opacity:0}}
                className='text-center w-64 text-red-600'
            >
                {message}
            </motion.p>
        </React.Fragment>
    );
}

export default LoginPage;
