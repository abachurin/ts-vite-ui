import { css } from "@emotion/react";
import Pane from "./Pane";

/**
 * Renders the Agent Pane component on the left, goes top on small screen.
 */
const PaneAgent = () => {
    return (
        <Pane id='agent-pane'>
            <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga
                ullam labore esse dolor animi deserunt eveniet quis hic, quo
                accusantium earum totam, velit voluptates error blanditiis,
                voluptatum reiciendis! Ipsum, magni.
            </p>
            <p>2</p>
            <p>3</p>
        </Pane>
    );
};

export default PaneAgent;
