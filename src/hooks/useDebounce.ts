import { useEffect } from "react";
import useTimeout from "./useTimeout";
export default function useDebounce(callback: Function, delay = 100, dependencies = []) {
    const [ reset, clear ] = useTimeout(callback, delay);
    useEffect(reset, [...dependencies, reset]);
    useEffect(clear, [clear]);
}
