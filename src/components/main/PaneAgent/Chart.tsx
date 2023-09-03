import { css } from "@emotion/react";
import { useMemo } from "react";
import Plot from "react-plotly.js";
import useDimensions from "../../../hooks/useDimensions";
import useFontScale from "../../../hooks/useFontScale";
import { Offset } from "../../../types";

// Emotion styles
const makeEmotion = (width: number, height: number) => css`
    width: ${width}px;
    height: ${height}px;
`;

type ChartProps = {
    name: string;
    history: number[];
    step: number;
};
const Chart = ({ name, history, step }: ChartProps) => {
    const { width, height } = useDimensions();
    const w = Math.min(0.8 * width, 1000);
    const h = Math.min(0.8 * height, 0.8 * w);

    const scale = useFontScale();

    const data: Offset[] = Array.from(history, (value, index) => ({
        x: (index + 1) * step,
        y: value,
    }));

    const emotion = useMemo(() => makeEmotion(w, h), [w, h]);

    return (
        <div css={emotion}>
            <Plot
                data={[
                    {
                        x: data.map(({ x }) => x),
                        y: data.map(({ y }) => y),
                        type: "scatter",
                        mode: "lines+markers",
                        marker: { color: "blue" },
                    },
                ]}
                layout={{
                    width: w,
                    height: h,
                    margin: {},
                    title: {
                        text: `Training History Chart of ${name}`,
                        font: { size: scale * 12 },
                    },
                    font: { size: scale * 8 },
                    xaxis: {
                        title: {
                            text: "Number of Training Episodes",
                            font: { size: scale * 10 },
                        },
                    },
                    yaxis: {
                        title: {
                            text: "Average Score",
                            font: { size: scale * 10 },
                        },
                    },
                }}
            />
        </div>
    );
};

export default Chart;
