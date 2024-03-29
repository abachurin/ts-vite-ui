import { css } from "@emotion/react";
import { useMemo } from "react";
import Plot from "react-plotly.js";
import useDimensions from "../../../hooks/useDimensions";
import useFontScale from "../../../hooks/useFontScale";
import { Offset, Agent } from "../../../types";

// Emotion styles
const makeEmotion = (width: number, height: number) => css`
    width: ${width}px;
    height: ${height}px;
`;

/**
 * Training History Chart.
 * @param agent - Agent
 */
const Chart = ({ agent }: { agent: Agent }) => {
    const { width, height } = useDimensions({});
    const w = Math.min(0.8 * width, 1000);
    const h = Math.min(0.8 * height, 0.7 * w);

    const scale = useFontScale();

    const data: Offset[] = Array.from(agent.history, (value, index) => ({
        x: (index + 1) * agent.collectStep,
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
                        mode: "lines",
                        marker: { color: "blue" },
                    },
                ]}
                layout={{
                    width: w,
                    height: h,
                    margin: {},
                    title: {
                        text: `Training History Chart of ${agent.name}`,
                        font: { size: scale * 10 },
                    },
                    font: { size: scale * 8 },
                    xaxis: {
                        title: {
                            text: "Number of Training Episodes",
                            font: { size: scale * 8 },
                        },
                    },
                    yaxis: {
                        title: {
                            text: "Average Score",
                            font: { size: scale * 8 },
                        },
                    },
                }}
            />
        </div>
    );
};

export default Chart;
