import { useState,useEffect, Dispatch, SetStateAction } from "react";

const useCountdown = (seconds: number): [number,Dispatch<SetStateAction<number>>] => {
    const [remainingTime, setRemainingTime] = useState(seconds);
    useEffect(() => {
        if(remainingTime === 0) return;
        const countdownTimeout = setTimeout(()=> setRemainingTime(remainingTime-1),1000);
        return () => {
            clearTimeout(countdownTimeout)
        };
    }, [remainingTime]);
    
    return [remainingTime,setRemainingTime];
}

export default useCountdown;