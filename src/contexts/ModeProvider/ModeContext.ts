import { createContext, useContext } from "react";
import { ModeOfAction } from "../../types";

export const ModeContext = createContext<ModeOfAction>("none");
export const ModeUpdateContext = createContext<
    (newState: ModeOfAction) => void
>((newState: ModeOfAction) => console.log(newState));

export const useMode = () => useContext(ModeContext);
export const useModeUpdate = () => useContext(ModeUpdateContext);

export const modeDescriptions = {
    none: "Waiting for action",
    train: "Training Agent",
    test: "Testing Agent",
    watch: "Watching Agent Play",
    replay: "Replaying Stored Game",
    play: "Playing Yourself",
};
