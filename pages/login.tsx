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
    const [userData, setUserData] = useState({
        username: "",
        password: "",
        method: "",
        regCode: ""
    });
    const [apiEmailValidationResponse, setApiEmailValidationResponse] = useState({
        statusCode: 0,
        message: ""
    });
    const [apiRegCodeResponse, setApiRegCodeResponse] = useState({
        statusCode: 0,
        message: "",
        authCode: ""
    });

    useEffect(() => {
        if (!apiRegCodeResponse.statusCode) return;
        if (apiRegCodeResponse.statusCode === 200) {
            let userDataCopy = userData;
            userDataCopy.regCode = apiRegCodeResponse.authCode;
            setUserData(userDataCopy);
            setIsLoading(false);
            setFormTitle("Registrace");
            return
        }
        setErrorMessage("Došlo k problému");
        setFormStyle("invalid");
        setIsLoading(false);
    }, [apiRegCodeResponse]);


    useEffect(() => {
        if (!apiEmailValidationResponse.statusCode && !apiRegCodeResponse.statusCode) return;

        if (apiEmailValidationResponse.statusCode === 200) {
            let userDataCopy = userData;
            userDataCopy.method = 'LOGIN';
            setUserData(userDataCopy);
            setIsLoading(false);
            setFormTitle("Heslo");
            return;
        }

        if (apiEmailValidationResponse.statusCode === 404) {
            let userDataCopy = userData;
            userDataCopy.method = 'REGISTER';
            setUserData(userDataCopy);
            (async () => {
                try {
                    const response = await (await fetch(`/api/mail/regauth`, {
                        method: 'POST',
                        body: JSON.stringify({
                            sendToEmail: `${userData.username}@teleinformatika.eu`
                        })
                    })).json();
                    setApiRegCodeResponse(response);
                } catch (error) {
                    setErrorMessage("Došlo k problému");
                }
            })()
            return;
        }

        setErrorMessage(apiEmailValidationResponse.message);
        setFormStyle("invalid");
        setIsLoading(false);
    }, [apiEmailValidationResponse]);

    const validateEmailRequest = async () => {
        try {
            const response = await (await fetch(`/api/users/check`, {
                method: 'POST',
                body: JSON.stringify({
                    userEmail: `${userData.username}@teleinformatika.eu`
                })
            })).json();
            setApiEmailValidationResponse(response);
        } catch (error) {
            setErrorMessage("Došlo k problému");
        }
    }

    const handleChangeAccount = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined) => {
        e?.preventDefault();
        setErrorMessage("");
        // TODO add all kinds of data reset etc. registration data,...
        setUserData({
            username: "",
            password: "",
            method: "",
            regCode: ""
        });
        setApiEmailValidationResponse({
            statusCode: 0,
            message: ""
        });
        setApiRegCodeResponse({
            statusCode: 0,
            message: "",
            authCode: ""
        });
        setIsLoading(false);
        setFormTitle("Tele Cloud");
    }

    const handlePasswordEnter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setErrorMessage("");
        if (userData.method === "LOGIN") {
            // Login route
            return
        }
        if (userData.method === "REGISTER") {
            // Register route
            return;
        }
    }

    const handleEmailEnter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, username: string) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);
        let userDataCopy = userData;
        userDataCopy.username = username.toLowerCase();
        setUserData(userDataCopy);
        validateEmailRequest();
    }

    const handleCodeEnter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>, regCode: string) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);
        if (regCode === userData.regCode) {
            setFormStyle("valid");
            setIsLoading(false);
            setFormTitle("Heslo");
            setFormStyle("default");
            return;
        }
        setErrorMessage("Kód nesouhlasí");
        setFormStyle("invalid");
        setIsLoading(false);
    }

    return (
        <div className='h-screen w-screen flex justify-center items-center bg-slate-200'>
            <Head>
                <title>Tele Cloud</title>
                <link rel="icon" href="/favicon.svg" />
            </Head>
            <form className='duration-400 flex items-center flex-col w-full h-full justify-center bg-white md:w-fit md:h-fit md:px-10 md:py-14 md:border md:border-gray-300 md:shadow-xl md:rounded-xl overflow-hidden'>
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
                        username={userData.username}
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
