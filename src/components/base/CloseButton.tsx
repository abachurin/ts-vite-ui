import { css } from "@emotion/react";
import { GLOBAL } from "../../utils";
import Button from "./Button/Button";
import Icon from "./Icon";

// Emotion styles
const emotion = css`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
    top: 0;
    background-color: inherit;
    color: inherit;
    border-radius: ${GLOBAL.borderRadius};
    z-index: 300;
`;

/**
 * Renders a Close button component with an onClick event handler.
 */
const CloseButton = () => {
    return (
        <div css={emotion}>
            <Button toggleModal={false}>
                <Icon svg={GLOBAL.svg.closeWindow} baseScale={1.4} />
            </Button>
        </div>
    );
};

export default CloseButton;
