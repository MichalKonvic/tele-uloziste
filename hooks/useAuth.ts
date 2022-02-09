import { useState, useEffect } from 'react'
import useStorage from './useStorage';

interface responseDataI{
    statusCode: 200|400|404|401|500,
    message: string,
    token?: string,
    expiratesAt?: Date,
    permissions?: Object
}
// TODO timeout to refresh the access token
const useAuth = () => {
    const { getItem, setItem } = useStorage();
    const [updateEvent, setUpdateEvent] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [isLoading, setLoading] = useState(true);

    const isStorageValid = (): boolean => {
        const storageData = getItem(process.env.NEXT_PUBLIC_STORAGE_KEY as string, "local");
        if (!storageData) return false;
        try {
            const jsonData = JSON.parse(storageData);
            //FIXME uncomment when permissions are implemented
            if (!jsonData.accessToken /*|| !jsonData.permissions*/ || !jsonData.expiratesAt) {
                return false;
            }
            // TODO test if access token is valid
            return true;
        } catch (error) {
            return false;
        }
    }
    const updateTimeout = (expirationDate: Date):NodeJS.Timeout => {
        return setTimeout(() => {
            setUpdateEvent(true);
        }, expirationDate - new Date());
    }

    // initial Effect
    useEffect(() => {
        let updateTokenTimeout:undefined|NodeJS.Timeout = undefined;
        if (isStorageValid() && !updateEvent) {
            setIsLogged(true);
            setLoading(false);
            return
        };
        // FIXME in production change creadentials to same-origin
        (async () => {
            try {
                const responseAccessToken:responseDataI = await (await fetch(`/api/auth/accessToken`, {
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })).json();
                if (responseAccessToken.statusCode !== 200) {
                    // Throw error on server error
                    if (responseAccessToken.statusCode === 500) {
                        throw new Error("Server responded with server error!");
                    }
                    setIsLogged(false);
                    setLoading(false);
                    return
                }
                setItem(process.env.NEXT_PUBLIC_STORAGE_KEY as string, JSON.stringify({
                    accessToken: responseAccessToken.token,
                    permissions: responseAccessToken.permissions,
                    expiratesAt: responseAccessToken.expiratesAt
                }), 'local');
                if(responseAccessToken.expiratesAt) updateTokenTimeout = updateTimeout(responseAccessToken.expiratesAt);
                setIsLogged(true);
                setLoading(false);
            } catch (error) {
                setIsLogged(false);
                setLoading(false);
                console.warn("Catched access token fetch error");
            }
            setUpdateEvent(false);
        })()
        return () => {
            if(updateTokenTimeout) clearTimeout(updateTokenTimeout);
        }
    });
    return [
        isLogged,
        isLoading
    ];
}
export default useAuth;
