import React, { useEffect, useState, useRef, KeyboardEvent, FormEvent } from 'react';
import Head from 'next/head'
import { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import EmailGrabber from '../components/LoginPage/EmailGrabber';
import PasswordGrabber from '../components/LoginPage/PasswordGrabber';
import CodeGrabber from '../components/LoginPage/CodeGrabber';


const LoginPage: NextPage = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [formTitle, setFormTitle] = useState("Tele Cloud");
    const [isLoading, setIsLoading] = useState(false);
    const [formStyle, setFormStyle] = useState("default");

    const handleChangeAccount = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined) => {
        e?.preventDefault();
        // TODO add all kinds of data reset etc. registration data,...
        setIsLoading(false)
        setFormTitle("Tele Cloud");
    }

    const handlePasswordEnter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
    }

    const handleEmailEnter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
    }

    const handleCodeEnter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
    }

    return (
        <div className='h-screen w-screen flex justify-center items-center bg-slate-200'>
            <Head>
                <title>Tele Cloud</title>
                <link rel="icon" href="/favicon.svg" />
            </Head>
            <form className='duration-400 flex items-center flex-col w-full h-full justify-center bg-white md:w-fit md:h-fit md:px-10 md:py-14 md:border md:border-gray-300 md:shadow-xl md:rounded-lg overflow-hidden'>
                <div className='flex items-center justify-center overflow-hidden py-2'>
                    <AnimatePresence exitBeforeEnter>
                        <motion.h1
                            key={formTitle}
                            initial={{ y: 200 }}
                            animate={{ y: 0 }}
                            exit={{ y: -200 }}
                            className='text-5xl font-bold text-gray-700 duration-200 ease-out'>{formTitle}</motion.h1>
                    </AnimatePresence>
                </div>
                <div className='mt-2 w-full mb-5 flex justify-center'>
                    <ErrorMessage message={errorMessage} />
                </div>
                <AnimatePresence>
                    {formTitle == "Tele Cloud" && <EmailGrabber
                        handleSubmit={handleEmailEnter}
                        isLoading={isLoading}
                        style={formStyle}
                        setStyle={setFormStyle}
                    />}
                    {formTitle == "Heslo" && <PasswordGrabber
                        handleAccountChange={handleChangeAccount}
                        isLoading={isLoading}
                        style={formStyle}
                        setStyle={setFormStyle}
                        username={"username"}
                        handleSubmit={handlePasswordEnter} />}
                    {formTitle == "Registrace" && <CodeGrabber
                        handleAccountChange={handleChangeAccount}
                        isLoading={isLoading}
                        style={formStyle}
                        setStyle={setFormStyle}
                        handleSubmit={handleCodeEnter} />}
                </AnimatePresence>
            </form>
        </div>
    );
};

const ErrorMessage = ({ message }: { message: string | undefined }) => {
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
