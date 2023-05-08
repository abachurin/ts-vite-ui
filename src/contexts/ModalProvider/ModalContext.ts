import { createContext, useContext } from "react";
import { ModalState } from "../../types";

export const ModalContext = createContext<ModalState>("none");
export const ModalUpdateContext = createContext<(newState: ModalState) => void>(
    (newState: ModalState) => console.log(newState)
);

export const useModal = () => useContext(ModalContext);
export const useModalUpdate = () => useContext(ModalUpdateContext);
