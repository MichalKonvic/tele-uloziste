import React, { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router'
import DotLoader from './loaders/DotLoader'
import useAuth from '../hooks/useAuth'
const PrivateRoute = ({ children, setAuthData }: { children: any, setAuthData?: Dispatch<SetStateAction<Object>> }) => {
    const router = useRouter()
    const [isLogged, isLoading] = useAuth();

    // Loader
    // MUST be on top of all renders
    if (isLoading) return <div className='h-screen w-screen flex justify-center items-center bg-slate-200'>
        <DotLoader />
    </div>
    if (!isLogged) {
        router.push(`/login`);
        return null;
    }
    return (
        <React.Fragment>
            {isLogged && <React.Fragment>{children}</React.Fragment>}
        </React.Fragment>
    );
};

export default PrivateRoute;
