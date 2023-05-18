import { createContext, useContext } from "react";
import { ModeOfAction } from "../../types";

export const BaseMode: ModeOfAction = {
    agent: "none",
    game: "none",
};
export const ModeContext = createContext<ModeOfAction>(BaseMode);
export const ModeUpdateContext = createContext<
    (update: Partial<ModeOfAction>) => void
>((update) => {
    console.log("Mode Context = " + update);
});

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
