import { createContext, useContext } from "react";
import { ModalState } from "../../types";

export const ModalContext = createContext<ModalState>("none");
export const ModalUpdateContext = createContext<(update: ModalState) => void>(
    (update) => console.log("Modal context = " + update)
);

export const useModal = () => useContext(ModalContext);
export const useModalUpdate = () => useContext(ModalUpdateContext);
