import { useState, useMemo } from "react";
import { ModeContext, ModeUpdateContext } from "./ModeContext";
import { ChildrenProps, ModeOfAction } from "../../types";

/**
 * Creates a ModalProvider Context Provider.
 * The aim is to be able to close the Modal from any Component inside.
 * @param children - The child components to be wrapped.
 */
const ModeProvider = ({ children }: ChildrenProps) => {
    const [mode, setMode] = useState<ModeOfAction>("none");

    const changeIsOpen = useMemo(
        () => (newState: ModeOfAction) => {
            setMode(newState);
        },
        [setMode]
    );

    return (
        <ModeContext.Provider value={mode}>
            <ModeUpdateContext.Provider value={changeIsOpen}>
                {children}
            </ModeUpdateContext.Provider>
        </ModeContext.Provider>
    );
};

export default ModeProvider;
