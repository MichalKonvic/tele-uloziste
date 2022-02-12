import React, { useEffect, useState, useRef, KeyboardEvent, FormEvent } from 'react';
import Head from 'next/head'
import { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import EmailGrabber from '../components/LoginPage/EmailGrabber';
import PasswordGrabber from '../components/LoginPage/PasswordGrabber';
import CodeGrabber from '../components/LoginPage/CodeGrabber';
import { useRouter } from 'next/router';


const LoginPage: NextPage = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
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
        message: "",
        cacheUID: ""
    });
    const [apiRegCodeValidationResponse, setApiRegCodeValidationResponse] = useState({
        statusCode: 0,
        message: ""
    })
    const [apiRegistrationResponse, setApiRegistrationResponse] = useState({
        statusCode: 0,
        message: "",
        token: ""
    })
    const [apiLoginResponse, setApiLoginResponse] = useState({
        statusCode: 0,
        message: "",
        token: ""
    })

    // Style reset
    useEffect(() => {
        setFormStyle("default");
    }, [formTitle]);




    // TODO HERE
    // Login handle    
    useEffect(() => {
        if (!apiLoginResponse.statusCode) return;
        if (apiLoginResponse.statusCode === 200) {
            // TODO save somewhere jwt token
            setFormStyle("valid");
            setIsLoading(false);
            setFormTitle("Vítejte");
            router.push("/");
            return;
        }
        if (apiLoginResponse.statusCode === 401) {
            // TODO save somewhere jwt token
            setIsLoading(false);
            setErrorMessage("Špatné heslo");
            setFormStyle("invalid");
            return;
        }
        setFormStyle("invalid");
        setErrorMessage("Došlo k problému");
        setIsLoading(false);
    }, [apiLoginResponse]);

    // TODO HERE
    // Registration handle 
    useEffect(() => {
        if (!apiRegistrationResponse.statusCode) return;
        if (apiRegistrationResponse.statusCode === 201) {
            // TODO save somewhere jwt token
            setFormStyle("valid");
            setIsLoading(false);
            setFormTitle("Vítej");
            return;
        }
        if (apiRegistrationResponse.statusCode === 410) {
            setFormStyle("invalid");
            setIsLoading(false);
            setErrorMessage(apiRegistrationResponse.message);
            handleChangeAccount();
            setFormTitle("Tele Cloud");
            return;
        }
        setFormStyle("invalid");
        setErrorMessage("Došlo k problému");
        setIsLoading(false);
    }, [apiRegistrationResponse]);

    // Registration code handle 
    useEffect(() => {
        if (!apiRegCodeValidationResponse.statusCode) return;
        if (apiRegCodeValidationResponse.statusCode === 200) {
            setFormStyle("valid");
            setIsLoading(false);
            setFormTitle("Heslo");
            return;
        }
        if (apiRegCodeValidationResponse.statusCode === 401) {
            setIsLoading(false);
            setFormStyle("invalid");
            setErrorMessage("Kód nesouhlasí");
            return;
        }
        setFormStyle("ivalid");
        setErrorMessage("Došlo k problému");
        setIsLoading(false);
    }, [apiRegCodeValidationResponse]);

    // Email check handle 
    useEffect(() => {
        if (!apiEmailValidationResponse.statusCode) return;

        if (apiEmailValidationResponse.statusCode === 200) {
            let userDataCopy = userData;
            userDataCopy.method = 'LOGIN';
            setUserData(userDataCopy);
            setIsLoading(false);
            setFormTitle("Heslo");
            return;
        }
        if (apiEmailValidationResponse.statusCode === 404 && apiEmailValidationResponse?.cacheUID) {
            let userDataCopy = userData;
            userDataCopy.method = 'REGISTER';
            setUserData(userDataCopy);
            setIsLoading(false);
            setFormTitle("Registrace");
            return;
        }
        setErrorMessage(apiEmailValidationResponse.message);
        setFormStyle("invalid");
        setIsLoading(false);
    }, [apiEmailValidationResponse]);

    // Email check request
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

    // Registration Code validation request
    const validateRegCodeRequest = async () => {
        try {
            const response = await (await fetch(`/api/mail/registration/validatecode`, {
                method: 'POST',
                body: JSON.stringify({
                    uID: apiEmailValidationResponse.cacheUID,
                    regCode: userData.regCode
                })
            })).json();
            setApiRegCodeValidationResponse(response);
        } catch (error) {
            setErrorMessage("Došlo k problému");
        }
    }

    // Account register request
    const registerAccountRequest = async () => {
        try {
            const response = await (await fetch(`/api/users/register`, {
                method: 'POST',
                body: JSON.stringify({
                    userEmail: `${userData.username}@teleinformatika.eu`,
                    password: userData.password,
                    uID: apiEmailValidationResponse.cacheUID
                })
            })).json();
            setApiRegistrationResponse(response);
        } catch (error) {
            setErrorMessage("Došlo k problému");
        }
    }

    // Account login request
    const loginAccountRequest = async () => {
        try {
            const response = await (await fetch(`/api/users/login`, {
                method: 'POST',
                body: JSON.stringify({
                    userEmail: `${userData.username}@teleinformatika.eu`,
                    password: userData.password
                })
            })).json();
            setApiLoginResponse(response);
        } catch (error) {
            setErrorMessage("Došlo k problému");
        }
    }


    const handleChangeAccount = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined) => {
        e?.preventDefault();
        // TODO add all kinds of data reset etc. registration data,...
        setUserData({
            username: "",
            password: "",
            method: "",
            regCode: ""
        });
        setApiEmailValidationResponse({
            statusCode: 0,
            message: "",
            cacheUID: ""
        });
        setApiRegCodeValidationResponse({
            statusCode: 0,
            message: ""
        })
        setApiRegistrationResponse({
            statusCode: 0,
            message: "",
            token: ""
        });
        setApiLoginResponse({
            statusCode: 0,
            message: "",
            token: ""
        });
        setIsLoading(false);
        setFormTitle("Tele Cloud");
    }

    const handlePasswordEnter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, password: string) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);
        if (userData.method === "LOGIN") {
            let userDataCopy = userData;
            userDataCopy.password = password;
            setUserData(userDataCopy);
            loginAccountRequest();
            return
        }
        if (userData.method === "REGISTER") {
            let userDataCopy = userData;
            userDataCopy.password = password;
            setUserData(userDataCopy);
            registerAccountRequest();
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
        let userDataCopy = userData;
        userDataCopy.regCode = regCode;
        setUserData(userDataCopy);
        validateRegCodeRequest();
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
