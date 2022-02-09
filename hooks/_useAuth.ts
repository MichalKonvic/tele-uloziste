import { useState,useEffect } from 'react';
import useStorage from './useStorage';
interface responseDataI{
    statusCode: 200|400|404|401|500,
    message: string,
    token?: string,
    expiresIn?: Date,
    permissions?: Object
}
type responseDataT = {
    statusCode: 200|400|404|401|500|0,
    message: string,
    token?: string,
    expiratesAt?: Date| null,
    permissions?: Object
}

type authDataT = {
    "accessToken": string,
    "expiratesAt": Date | null,
    "permissions": {}
}
type loginRequiredDataT = undefined | boolean;

function useAuth() {
    const { getItem, setItem } = useStorage();
    const [authData, setAuthData] = useState<authDataT>({
        "accessToken": "",
        "expiratesAt": null,
        "permissions": {}
    });
    const [loginRequired, setLoginRequired] = useState<loginRequiredDataT>(undefined);
    const [accessResponse, setAccessResponse] = useState<responseDataT>({
            statusCode: 0,
            message: "",
            token: "",
            expiratesAt: null,
            permissions: {}
    });
    const accessTokenRequest = async () => {
        try {
            const request:responseDataI = await (await fetch('/api/auth/accessToken', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })).json();
            setAccessResponse(request);
        } catch (error) {
            console.error(error);
            setAccessResponse({
                statusCode: 500,
                message: "Došlo k problému"
            });
        }
    }
    const updateToken = (expirationDate:Date): NodeJS.Timeout => {
        const updateTimeout = setTimeout(() => {
            accessTokenRequest();
        }, expirationDate - new Date());
        return updateTimeout;
    }
    const sessionData = getItem(process.env.SESSION_KEY || "TELE_CLOUD_APP");
    useEffect(() => {
        if (!accessResponse.statusCode && loginRequired === undefined) return;
        if (accessResponse.statusCode === 200) {
            let authDataCopy = authData;
            authDataCopy.accessToken = accessResponse.token;
            authDataCopy.expiratesAt = accessResponse.expiratesAt;
            authDataCopy.permissions = accessResponse.permissions;
            setAuthData(authDataCopy);
            setItem(process.env.SESSION_KEY || "TELE_CLOUD_APP", JSON.stringify(authData));
            setLoginRequired(false);
            setAccessResponse({
                statusCode: 0,
                message: "",
                token: "",
                expiratesAt: null,
                permissions: {}
            });
        } else {
            setLoginRequired(true);
            setAccessResponse({
                statusCode: 0,
                message: "",
                token: "",
                expiratesAt: null,
                permissions: {}
            });
        }
    }, [accessResponse]); 

    // useEffect(() => {
    //     if (authData.expiratesAt === "") return;
    //     const updateTimeout = updateToken(authData.expiratesAt);
    //     return () => {
    //         clearTimeout(updateTimeout);
    //     };
    // }, [authData]);
    if (sessionData && loginRequired === undefined) {
        try {
            const sessionJson = JSON.parse(sessionData);
            if (sessionJson.accessToken && sessionJson.expiratesAt) {
                setLoginRequired(false);
                setAuthData(sessionJson);
                return [authData,loginRequired];
            }
            throw new Error("Invalid session storage data");
        } catch (error) {
        }
    } else {
        if (accessResponse.statusCode === 0 && loginRequired === undefined) {
            accessTokenRequest()
        };
    }
    return [authData, loginRequired];
}


export default useAuth;