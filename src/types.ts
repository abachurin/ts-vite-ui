import { SerializedStyles } from "@emotion/react";

// CSS-related types
export type RGB = `rgb(${number}, ${number}, ${number})`;
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export type Alignment = "left" | "center" | "right";
export type ModalState = boolean | "none";

// HTML-related types
export type EventKey = keyof HTMLElementEventMap | keyof WindowEventMap;
export type EventCallback = (e: Event) => void;
export type StyledHTMLElement = HTMLElement & {
    style: CSSStyleDeclaration;
};
export type InputType =
    | "text"
    | "password"
    | "email"
    | "number"
    | "search"
    | "tel"
    | "url";

// Common Prop types
export interface UserName {
    userName: string;
}
export interface ChildrenProps {
    children?: React.ReactNode;
}
export interface AlignProps {
    align?: Alignment;
}

// User styles
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
};
export type UserLoginAction = "login" | "register" | "delete" | "logout";
export type UserLogin = {
    name: string;
    pwd: string;
};
export type LoginResponse = {
    status: string;
    content: User | undefined;
};

// Palette styles
export interface Palette {
    name: string;
    background: RGB;
    text: RGB;
    header: RGB;
    headerOpacity: number;
    logo: RGB;
    pane: RGB;
    paneOpacity: number;
    one: RGB;
    two: RGB;
    three: RGB;
    four: RGB;
    success: RGB;
    error: RGB;
    warning: RGB;
    info: RGB;
    logs: RGB;
}

export type Palettes = {
    [name: string]: Palette;
};

// Button types
export type ButtonVariants = "whooshRotate" | "clickPress";
export type ButtonExtraStyle = (background: string) => SerializedStyles;
export type ButtonEffects = (
    el: HTMLButtonElement,
    volume: number,
    animate: boolean
) => void;

// Draggable types
export type Position = {
    x: string;
    y: string;
};
export type Offset = {
    x: number;
    y: number;
};
export type PositionType = "fixed" | "absolute";

// Alert types
export type AlertColors = "success" | "error" | "warning" | "info";

// Agent and Agent Job types
export interface AgentMainParams {
    user?: string;
    name: string | undefined;
    N: number | undefined;
    alpha: number | undefined;
    decay: number | undefined;
    step: number | undefined;
    minAlpha: number | undefined;
}
export interface Agent extends AgentMainParams {
    bestScore: number;
    maxTile: number;
    lastTrainingEpisode: number;
    history: number[];
    collectStep: number;
}

export type AgentDict = Record<string, Agent>;

export interface AgentTraining extends AgentMainParams {
    episodes: number | undefined;
    isNew: boolean;
}
export interface AgentWatchingBase {
    user?: string;
    name: string | undefined;
    depth: number | undefined;
    width: number | undefined;
    trigger: number | undefined;
}

export interface AgentWatching extends AgentWatchingBase {
    startGame: GameForWatch;
    previous: string;
}

export interface AgentTesting extends AgentWatchingBase {
    episodes: number | undefined;
}

// Job Description types
export interface Job {
    description: string;
    type: number;
    name: string;
    episodes: number;
    start: string;
    timeElapsed: string;
    remainingTimeEstimate: string;
}

export interface TrainJobDescription extends Job {
    currentAlpha: number;
}

export interface TestJobDescription extends Job {
    depth: number;
    width: number;
    trigger: number;
}

export type JobDescription = TrainJobDescription | TestJobDescription | null;

export type JobDescriptionResponse = {
    status?: string;
    job?: JobDescription;
};

// Logs types
export type Logs = string[];

export type LogsResponse = {
    status: string;
    logs: Logs;
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

export type GameForWatch = {
    name: string;
    initial: number[][];
    score: number;
    numMoves: number;
};

export type GameWatchNew = {
    user: string;
    startGame: GameForWatch;
};

export interface GameCore {
    user?: string;
    name: string;
    row: number[][];
    score: number;
}

export interface GameDescription extends GameCore {
    numMoves: number;
    maxTile: number;
}

export interface GameBackend extends GameCore {
    initial: number[][];
    moves: number[];
    tiles: GameTile[];
}
export interface Game extends GameBackend {
    isOver: boolean;
    pointer: GamePointer;
    lastTile?: GameTile;
    nextMove?: number;
}

export type GameDict = Record<string, GameDescription>;

export type FullGameResponse = {
    status: string;
    game?: GameBackend;
};

// Items (agents and games) types
export type ItemListRequestType = "all" | "user";
export type ItemType = "Agents" | "Games";

export interface ItemListRequest extends UserName {
    scope: ItemListRequestType;
}

export type ItemListResponse = {
    status?: string;
    list?: AgentDict | GameDict;
};

export type ItemDeleteRequest = {
    name: string;
    kind: string;
};

export type JustNamesResponse = {
    status?: string;
    list?: string[];
};

// Watch Agent game retrieval types
export interface NewMovesRequest extends UserName {
    name: string;
    numMoves: number;
}

export type NewMovesResponse = {
    status?: string;
    moves?: number[];
    tiles?: GameTile[];
    loadingWeights?: boolean;
};
