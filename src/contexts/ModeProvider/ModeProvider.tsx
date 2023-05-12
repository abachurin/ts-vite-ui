import { useState, useMemo } from "react";
import { ModeContext, ModeUpdateContext, BaseMode } from "./ModeContext";
import { ChildrenProps, ModeOfAction } from "../../types";

/**
 * Creates a ModeProvider Context Provider.
 * @param children - The child components to be wrapped.
 */
const ModeProvider = ({ children }: ChildrenProps) => {
    const [mode, setMode] = useState<ModeOfAction>(BaseMode);

    const changeMode = useMemo(
        () => (update: Partial<ModeOfAction>) => {
            setMode((prev) => ({ ...prev, ...update }));
        },
        [setMode]
    );

    return (
        <ModeContext.Provider value={mode}>
            <ModeUpdateContext.Provider value={changeMode}>
                {children}
            </ModeUpdateContext.Provider>
        </ModeContext.Provider>
    );
};

export default ModeProvider;
