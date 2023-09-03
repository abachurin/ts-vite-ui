import { RGB } from "./types";

type Palette = {
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
};
type Palettes = {
    [name: string]: Palette;
};
export type paletteAlertType =
    | "success"
    | "error"
    | "warning"
    | "info"
    | "logs";

export const palettes: Palettes = {
    One: {
        name: "One",
        background: "rgb(235, 235, 235)",
        text: "rgb(64, 64, 64)",
        header: "rgb(255, 130, 255)",
        headerOpacity: 0.3,
        logo: "rgb(255, 130, 255)",
        pane: "rgb(50, 50, 224)",
        paneOpacity: 0.1,
        one: "rgb(204, 112, 0)",
        two: "rgb(4, 96, 64)",
        three: "rgb(50, 50, 224)",
        four: "rgb(77, 39, 77)",
        success: "rgb(4, 96, 64)",
        error: "rgb(255, 0, 102)",
        warning: "rgb(255, 153, 51)",
        info: "rgb(0, 153, 204)",
        logs: "rgb(255, 140, 26)",
    },
    Two: {
        name: "Two",
        background: "rgb(235, 235, 235)",
        text: "rgb(64, 64, 64)",
        header: "rgb(130, 255, 255)",
        headerOpacity: 0.3,
        logo: "rgb(255, 130, 255)",
        pane: "rgb(50, 50, 224)",
        paneOpacity: 0.1,
        one: "rgb(204, 112, 0)",
        two: "rgb(4, 96, 64)",
        three: "rgb(50, 50, 224)",
        four: "rgb(77, 39, 77)",
        success: "rgb(4, 96, 64)",
        error: "rgb(255, 0, 0)",
        warning: "rgb(255, 153, 51)",
        info: "rgb(51, 204, 255)",
        logs: "rgb(246, 129, 0)",
    },
};
