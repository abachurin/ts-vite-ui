import { RGB } from "../../types";

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
}
export const paletteOne: Palette = {
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
};
