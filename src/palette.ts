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
        error: "rgb(200, 0, 0)",
        warning: "rgb(255, 153, 51)",
        info: "rgb(0, 153, 204)",
        logs: "rgb(255, 140, 26)",
    },
    Two: {
        name: "Two",
        background: "rgb(235, 235, 235)",
        text: "rgb(64, 64, 64)",
        header: "rgb(128, 128, 128)",
        headerOpacity: 0.3,
        logo: "rgb(255, 140, 26)",
        pane: "rgb(50, 50, 224)",
        paneOpacity: 0.1,
        one: "rgb(31, 122, 31)",
        two: "rgb(0, 128, 96)",
        three: "rgb(0, 61, 77)",
        four: "rgb(134, 179, 0)",
        success: "rgb(4, 96, 64)",
        error: "rgb(153, 0, 51)",
        warning: "rgb(255, 153, 51)",
        info: "rgb(102, 0, 204)",
        logs: "rgb(255, 140, 26)",
    },
    Three: {
        name: "Two",
        background: "rgb(235, 235, 235)",
        text: "rgb(64, 64, 64)",
        header: "rgb(102, 102, 153)",
        headerOpacity: 0.3,
        logo: "rgb(0, 179, 0)",
        pane: "rgb(50, 50, 224)",
        paneOpacity: 0.1,
        one: "rgb(89, 0, 179)",
        two: "rgb(128, 0, 96)",
        three: "rgb(77, 0, 77)",
        four: "rgb(150, 150, 0)",
        success: "rgb(4, 96, 64)",
        error: "rgb(0, 179, 0)",
        warning: "rgb(255, 153, 51)",
        info: "rgb(255, 153, 0)",
        logs: "rgb(246, 129, 0)",
    },
};
