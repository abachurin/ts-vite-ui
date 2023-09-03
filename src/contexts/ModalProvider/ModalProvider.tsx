import { useState, useCallback } from "react";
import { ModalContext, ModalUpdateContext } from "./ModalContext";
import { ChildrenProps, ModalState } from "../../types";

/**
 * Modal Context Provider.
 * @param children - components to be wrapped
 */
const ModalProvider = ({ children }: ChildrenProps) => {
    const [isOpen, setIsOpen] = useState<ModalState>("none");

    const changeIsOpen = useCallback(
        (newState: ModalState) => {
            setIsOpen(newState);
            if (newState === false) {
                setTimeout(() => {
                    setIsOpen("none");
                }, 800);
            }
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
