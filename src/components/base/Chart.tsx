import { css } from "@emotion/react";
import Plot from "react-plotly.js";
import { Offset } from "../../types";
import { GLOBAL } from "../../utils";

// Emotion styles
const emotion = css`
    width: 100%;
    margin-top: ${GLOBAL.padding};
    border-radius: ${GLOBAL.borderRadius};
    box-shadow: ${GLOBAL.boxShadow};
    background-color: white;
    border: 1px solid yellow;
`;

type ChartProps = {
    history: number[];
    step: number;
};
const Chart = ({ history, step }: ChartProps) => {
    const data: Offset[] = Array.from(history, (value, index) => ({
        x: (index + 1) * step,
        y: value,
    }));

    return (
        <div css={emotion}>
            <Plot
                data={[
                    {
                        x: [1, 2, 3],
                        y: [2, 6, 3],
                        type: "scatter",
                        mode: "lines+markers",
                        marker: { color: "red" },
                    },
                    { type: "bar", x: [1, 2, 3], y: [2, 5, 3] },
                ]}
                layout={{ width: 320, height: 240, title: "A Fancy Plot" }}
            />
        </div>
    );
};

export default Chart;
