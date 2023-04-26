import { useState, useEffect, useRef } from "react";
import { GLOBAL } from "../utils";

 /**
* Returns a tuple with a React ref, width, and height based on the size of the referenced HTML element.
* @param delay Optional delay before updating dimensions in milliseconds (default: value of GLOBAL.windowResizeDelay)
*/
const useDimensions = (delay = GLOBAL.windowResizeDelay): 
[React.RefObject<HTMLDivElement>, number, number] => {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        function handleSize() {
            clearTimeout(timer);
            timer = setTimeout(() => {
                setWidth(ref.current?.clientWidth || 0);
                setHeight(ref.current?.clientHeight || 0);
            }, delay);
        }

        window.addEventListener("load", handleSize);
        window.addEventListener("resize", handleSize);
        return () => {
            window.removeEventListener("load", handleSize);
            window.removeEventListener("resize", handleSize);
        };
    }, [delay]);

    return [ref, width, height];
}

export default useDimensions;
