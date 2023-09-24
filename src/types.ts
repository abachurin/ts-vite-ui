import { SerializedStyles } from "@emotion/react";

// Common types
export type RGB = `rgb(${number}, ${number}, ${number})`;
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export type Alignment = "left" | "center" | "right";
export type ModalState = boolean | "none";
export type UserName = {
    userName: string;
};
export type ChildrenProps = {
    children?: React.ReactNode;
};
export type AlignProps = {
    align?: Alignment;
};
export type Position = {
    x: string;
    y: string;
};
export type Offset = {
    x: number;
    y: number;
};
export type PositionType = "fixed" | "absolute";

// Button related types
export type ButtonVariants = "whooshRotate" | "clickPress";
export type ButtonExtraStyle = (background: string) => SerializedStyles;
export type ButtonEffects = (
    el: HTMLButtonElement,
    volume: number,
    animate: boolean
) => void;

// User type
export type User = {
    name: string;
    level: number;
    sound: boolean;
    soundLevel: number;
    animate: boolean;
    animationSpeed: number;
    legends: boolean;
    paletteName: string;
    agents: string[];
    logs: string[];
    lastLog: number;
};

// Agent and Agent Job types
export type AgentMainParams = {
    user?: string;
    name: string | undefined;
    N: number | undefined | "";
    alpha: number | undefined | "";
    decay: number | undefined | "";
    step: number | undefined | "";
    minAlpha: number | undefined | "";
};
export type Agent = AgentMainParams & {
    bestScore: number;
    maxTile: number;
    lastTrainingEpisode: number;
    history: number[];
    collectStep: number;
};
export type AgentDict = Record<string, Agent>;
export type AgentTraining = AgentMainParams & {
    episodes: number | undefined | "";
    isNew: boolean;
};
export type AgentWatchingBase = {
    user?: string;
    name: string | undefined;
    depth: number | undefined | "";
    width: number | undefined | "";
    trigger: number | undefined | "";
};
export type AgentTesting = AgentWatchingBase & {
    episodes: number | undefined | "";
};

// Game types
export type GameTile = {
    position: Offset;
    value: number;
};

export type GamePointer = {
    move: number;
    tile: number;
};
export type GameCore = {
    user?: string;
    name?: string;
    score: number;
};
export type GameDescription = GameCore & {
    numMoves: number;
    maxTile: number;
};
export type GameBackend = {
    initial: number[][];
    moves: number[];
    tiles: GameTile[];
};
export type Game = GameCore &
    GameBackend & {
        row: number[][];
        isOver: boolean;
        pointer: GamePointer;
        lastTile?: GameTile;
        nextMove?: number;
    };
export type GameDict = Record<string, GameDescription>;

// Watch Agent game retrieval types
export type NewMovesRequest = UserName & {
    numMoves: number;
};
export type NewMovesResponse = {
    status?: string;
    moves?: number[];
    tiles?: GameTile[];
    loadingWeights?: boolean;
};

// Items (agents and games) types
export type ItemListRequestType = "all" | "user";
export type ItemType = "Agents" | "Games";
export type ItemDeleteRequest = {
    name: string;
    kind: string;
};
