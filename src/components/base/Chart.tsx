import { css } from "@emotion/react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
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
            {/* <ResponsiveContainer width='100%' height='100%'> */}
            <LineChart
                width={450}
                height={150}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                data={data}
            >
                <Line type='monotone' dataKey='y' stroke='#8884d8' />
                <CartesianGrid stroke='blue' strokeDasharray='1 1' />
                <XAxis dataKey='x' />
                <YAxis />
            </LineChart>
            {/* </ResponsiveContainer> */}
        </div>
    );
};

export default Chart;
