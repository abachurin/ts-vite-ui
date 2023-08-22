import { create } from "zustand";

export type AgentModeOfAction = "none" | "train" | "test";
export type GameModeOfAction = "none" | "watch" | "replay" | "play";

export const modeDescription = (
    modeVar: AgentModeOfAction | GameModeOfAction,
    name?: string
): string => {
    switch (modeVar) {
        case "none":
            return "Waiting for action";
        case "train":
            return `Training "${name}"`;
        case "test":
            return `Testing "${name}"`;
        case "watch":
            return `Agent "${name}"`;
        case "replay":
            return `Game "${name}"`;
        case "play":
            return "Playing Yourself";
    }
};

interface ModeStore {
    agentMode: AgentModeOfAction;
    gameMode: GameModeOfAction;
    agentName: string;
    gameName: string;
    defaultMode: () => void;
    setAgentMode: (newAgentMode: AgentModeOfAction) => void;
    setGameMode: (newGameMode: GameModeOfAction) => void;
    setAgentName: (newAgentName: string | undefined) => void;
    setGameName: (newGameName: string | undefined) => void;
}

const useModeStore = create<ModeStore>()((set) => ({
    agentMode: "none",
    gameMode: "none",
    agentName: "",
    gameName: "",
    defaultMode: () => {
        set(() => ({
            agentMode: "none",
            gameMode: "none",
            agentName: "",
            gameName: "",
        }));
    },
    setAgentMode: (newAgentMode) => set(() => ({ agentMode: newAgentMode })),
    setGameMode: (newGameMode) => set(() => ({ gameMode: newGameMode })),
    setAgentName: (newAgentName) => set(() => ({ agentName: newAgentName })),
    setGameName: (newGameName) => set(() => ({ gameName: newGameName })),
}));

export default useModeStore;
