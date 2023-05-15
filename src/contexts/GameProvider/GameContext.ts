import { createContext, useContext } from "react";

export const GameContext = createContext<ModalState>("none");
export const GameUpdateContext = createContext<(update: ModalState) => void>(
    (update) => console.log("Modal context = " + update)
);

export const useGame = () => useContext(ModalContext);
export const useGameUpdate = () => useContext(ModalUpdateContext);
