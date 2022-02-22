import { SetStateAction, useState,useLayoutEffect } from "react";
const useMouseEvent = () => {
    const [mouseEvent, setMouseEvent] = useState<MouseEvent|null>(null);
    useLayoutEffect(() => {
        const mouseEventHandler = (e: MouseEvent) => setMouseEvent(e);
        window.addEventListener('mousemove', mouseEventHandler);
        return () => {
            window.removeEventListener('mousemove', mouseEventHandler);
        }
    }, []);
    return mouseEvent;
}
export default useMouseEvent;