import { useState, useEffect } from 'react'
import useStorage from './useStorage';

interface responseDataI{
    statusCode: 200|400|404|401|500,
    message: string,
    token?: string,
    expiratesAt?: Date,
    permissions?: Object
}
const useAuth = () => {
    const { getItem, setItem } = useStorage();
    const [isLogged, setIsLogged] = useState(false);
    const [isLoading, setLoading] = useState(true);

    const isTokenValid = async (token: string) => {
        try {
            const tokenValidationRes = await (await fetch(`/api/auth/tokenValidation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token
                })
            })).json();
            if (tokenValidationRes.statusCode !== 200) return false;
            return true;
        } catch (error) {
            return false;
        }
    }
    
    const isStorageValid = (): boolean => {
        const storageData = getItem(process.env.NEXT_PUBLIC_STORAGE_KEY as string, "local");
        if (!storageData) return false;
        try {
            const jsonData = JSON.parse(storageData);
            //FIXME uncomment when permissions are implemented
            if (!jsonData.accessToken /*|| !jsonData.permissions*/ || !jsonData.expiratesAt) {
                return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    const _getAccessToken = async () => {
        try {
                // FIXME in production change creadentials to same-origin
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
                }),'session');
                setIsLogged(true);
                setLoading(false);
            } catch (error) {
                setIsLogged(false);
                setLoading(false);
                console.warn("Catched access token fetch error");
            }
    }

    const refreshAccessToken = async () => {
        try {
            const token: string = JSON.parse(getItem(process.env.NEXT_PUBLIC_STORAGE_KEY as string,'session'))?.accessToken;
            if (!token) throw new Error("Token is missing");
            const isValid = await isTokenValid(token);
            if (!isValid) {
                _getAccessToken();
                return;
            }
            setIsLogged(true);
            return;
        } catch (error) {}
    }

    const logoutUser = async () => {
        // FIXME in production change creadentials to same-origin
        const logoutResponse = await fetch('/api/users/logout', {
            method: 'POST',
            credentials: 'include'
        });
        setItem(process.env.NEXT_PUBLIC_STORAGE_KEY as string, "",'session');
    }

    const getAcessToken = (): string => {
        const token: string = JSON.parse(
            getItem(process.env.NEXT_PUBLIC_STORAGE_KEY as string, 'session')
        )?.accessToken;
        return token
    }

    // initial Effect
    useEffect(() => {
        (async () => {
            if (isStorageValid()) {
                try {
                    const token: string = JSON.parse(getItem(process.env.NEXT_PUBLIC_STORAGE_KEY as string,'session'))?.accessToken;
                    if (!token) throw new Error("Token is missing");
                    const isValid = await isTokenValid(token);
                    if (!isValid) {
                        _getAccessToken();
                        return;
                    }
                    setIsLogged(true);
                    setLoading(false);
                    return;
                } catch (error) {}
            };
            _getAccessToken();
        })()
    },[]);
    return [
        isLogged,
        isLoading,
        refreshAccessToken,
        logoutUser,
        getAcessToken
    ];
}
export default useAuth;
