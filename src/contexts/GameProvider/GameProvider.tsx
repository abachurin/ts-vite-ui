import { useState, useMemo } from "react";
import { ModalContext, ModalUpdateContext } from "./ModalContext";
import { ChildrenProps, ModalState } from "../../types";

/**
 * Creates a ModalProvider Context Provider.
 * The aim is to be able to close the Modal from any Component inside.
 * @param children - The child components to be wrapped.
 */
const ModalProvider = ({ children }: ChildrenProps) => {
    const [isOpen, setIsOpen] = useState<ModalState>("none");

    const changeIsOpen = useMemo(
        () => (newState: ModalState) => {
            setIsOpen(newState);
        },
        [setIsOpen]
    );

    return (
        <ModalContext.Provider value={isOpen}>
            <ModalUpdateContext.Provider value={changeIsOpen}>
                {children}
            </ModalUpdateContext.Provider>
        </ModalContext.Provider>
    );
};

export default ModalProvider;
