import { RGB } from "../../types";

interface Palette {
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
    success: RGB;
    error: RGB;
}

type Palettes = {
    [name: string]: Palette;
};

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
        success: "rgb(4, 96, 64)",
        error: "rgb(255, 0, 0)",
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
        success: "rgb(4, 96, 64)",
        error: "rgb(255, 0, 0)",
    },
    "Nice Blue": {
        name: "Nice Blue and a bit of Yellow",
        background: "rgb(235, 235, 235)",
        text: "rgb(64, 64, 64)",
        header: "rgb(255, 255, 130)",
        headerOpacity: 0.3,
        logo: "rgb(130, 255, 255)",
        pane: "rgb(50, 50, 224)",
        paneOpacity: 0.1,
        one: "rgb(204, 112, 0)",
        two: "rgb(4, 96, 64)",
        three: "rgb(50, 50, 224)",
        success: "rgb(4, 96, 64)",
        error: "rgb(255, 0, 0)",
    },
};
