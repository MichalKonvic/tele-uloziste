import React, { useEffect } from 'react'
import { useRouter } from 'next/router';

const index = () => {
    const router = useRouter();
    useEffect(() => {
        router.push("/explorer/R");
    }, []);
    return (
        <div></div>
    )
}

export default index