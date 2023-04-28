import { createContext } from "react";
import { ModalState } from "../../types";

export const ModalContext = createContext<ModalState>("none");
export const ModalUpdateContext = createContext<(newState: ModalState) => void>(
    (newState: ModalState) => {
        console.log(newState);
    }
);
