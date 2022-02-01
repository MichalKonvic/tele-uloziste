import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head'
import { NextPage } from 'next';
import { motion, useAnimation } from 'framer-motion';
import EmailGrabber from '../components/LoginPage/EmailGrabber';
import PasswordGrabber from '../components/LoginPage/PasswordGrabber';
import CodeGrabber from '../components/LoginPage/CodeGrabber';

interface validationResponseI {
    statusCode: number,
    message: string
}
interface errorMessageI {
    message: string
}


const LoginPage: NextPage = () => {


    const [errorMessage, setErrorMessage] = useState("");
    const [formTitle, setFormTitle] = useState("Tele Cloud");
    const titleAnimation = useAnimation();
    const sectionAnimation = useAnimation();
    const sectionRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);



    /**
     * Intial animations
     */
    useEffect(() => {
        titleAnimation.start({ y: 0 });
        setTimeout(() => {
            sectionAnimation.start({ x: 0 });
        }, 500.);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formTransition = (
        component: JSX.Element
    ) => {
        // Every animation duration is 300ms
        sectionAnimation.start({ x: -480 });
        setTimeout(() => {
            sectionRef.current?.classList.remove("duration-300");
            sectionRef.current?.classList.add("opacity-0");
            setTimeout(() => {
                sectionAnimation.start({ x: 480 });
                setTimeout(() => {
                    sectionRef.current?.classList.remove("opacity-0");
                    sectionRef.current?.classList.add("duration-300");
                    setFormSection(component);
                    sectionAnimation.start({ x: 0 });
                }, 100);
            }, 100);
        }, 300);
    }

    const titleTransition = (
        title: string
    ) => {
        titleAnimation.start({ y: -100, opacity: 0 });
        setTimeout(() => {
            titleAnimation.start({ y: 100 });
        }, 300);
        setTimeout(() => {
            titleAnimation.start({ opacity: 1 });
        }, 600);
        setTimeout(() => {
            setFormTitle(title)
            titleAnimation.start({ y: 0 });
        }, 640);
    }



    const handleAccountChange = async (
        e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e?.preventDefault();
        titleTransition("Tele Cloud");
        formTransition(<EmailGrabber handleSubmit={handleEmailSubmit} />);
    }


    const handleRegistrationCodeSubmit = async (
        e: React.MouseEvent<HTMLInputElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>,
        code: string,
        codesDivRef: React.MutableRefObject<HTMLDivElement | null>
    ) => {
        e.preventDefault();
        // TODO handle registration code and visual effects
        if (false) {
            // if valid
            codesDivRef.current?.classList.remove("defaultCode-LoginPage");
            codesDivRef.current?.classList.add("validCode-LoginPage");

        }
        if (true) {
            // if invalid
            codesDivRef.current?.classList.remove("defaultCode-LoginPage");
            codesDivRef.current?.classList.add("invalidCode-LoginPage");
        }
    }


    /**
     * Email handling
     * @param e reference to button
     * @param inputRef reference to form inputBox
     * @returns Nothing
     */
    const handleEmailSubmit = async (
        e: React.MouseEvent<HTMLInputElement, MouseEvent>,
        inputRef: React.MutableRefObject<HTMLInputElement | null>
    ) => {
        e.preventDefault();
        // Cleans last errorMessages
        setErrorMessage("");
        const username: string | undefined = inputRef.current?.value.toLowerCase();
        const requestBody = {
            "userEmail": `${username}@teleinformatika.eu`
        };
        // POST request to validate email
        const validationResponse: validationResponseI = await (
            await fetch(
                `/api/users/check/`,
                {
                    method: 'POST',
                    body: JSON.stringify(requestBody)
                }
            )
        ).json();
        // user exists
        if (validationResponse.statusCode === 200) {
            // transition
            inputRef.current?.classList.add("text-green-400");
            titleTransition("Přihlášení");
            formTransition(<PasswordGrabber handleSubmit={handlePasswordSubmit} handleAccountChange={handleAccountChange} username={username} />);
            return;
        }

        // User needs registration
        if (validationResponse.statusCode === 404) {
            // TODO send email to grabbed email with confirmation code

            titleTransition("Registrace");
            // TODO FIXME add remainning time
            formTransition(
                <CodeGrabber handleSubmit={handleRegistrationCodeSubmit} handleAccountChange={handleAccountChange} remainingTime={100} />
            );
            return;
        }
        // Error occured
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
        e: React.FormEvent<HTMLInputElement>,
        inputRef: React.MutableRefObject<HTMLInputElement | null>
    ) => {
        e.preventDefault();
        // Cleans last errorMessages
        setErrorMessage("");

        // TODO make call to account validation
        const validationResponse: validationResponseI = await (await fetch(`/api/users/check/${inputRef.current?.value}@teleinformatika.eu`, {
            method: 'GET'
        })).json();

        if (validationResponse.statusCode === 200) {
            // valid style
            inputRef.current?.classList.add("text-green-400");
            // TODO continue to application
            return;
        }

        // invalid style
        inputRef.current?.classList.add("text-red-400");
        setErrorMessage(validationResponse.message);
    }



    // MUST be defined here due to usage of handleEmailSubmit before declaration
    const [formSection, setFormSection] = useState(<EmailGrabber handleSubmit={handleEmailSubmit} />);




    return (
        <div className='h-screen w-screen flex justify-center items-center bg-slate-200'>
            <Head>
                <title>Tele Cloud</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.svg" />
            </Head>
            <form className='duration-400 flex items-center flex-col w-full h-full justify-center bg-white md:w-fit md:h-fit md:px-10 md:py-14 md:border md:border-gray-300 md:shadow-xl md:rounded-lg overflow-hidden'>
                <div className='flex items-center justify-center overflow-hidden py-2'>
                    <motion.h1
                        initial={{ y: 200 }}
                        animate={titleAnimation}
                        className='text-5xl font-bold text-gray-700 duration-200 ease-out'>{formTitle}</motion.h1>
                </div>
                <div className='mt-2 w-full mb-5 flex justify-center'>
                    <ErrorMessage message={errorMessage} />
                </div>
                <motion.div
                    initial={{ x: 480 }}
                    animate={sectionAnimation}
                    className='duration-300 ease-out'
                    ref={sectionRef}
                >
                    {formSection}
                </motion.div>
            </form>
        </div>
    );
};

const ErrorMessage = ({ message }: errorMessageI) => {
    if (message === "") return null;
    return (
        <React.Fragment>
            <motion.p
                initial={{ x: 50 }}
                animate={{ x: 0 }}
                exit={{ opacity: 0 }}
                className='text-center w-64 text-red-600'
            >
                {message}
            </motion.p>
        </React.Fragment>
    );
}

export default LoginPage;
