import { css } from "@emotion/react";
import { GLOBAL } from "../../utils";
import Button from "./Button";
import Icon from "./Icon";

// Emotion styles
const emotion = css`
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
 * @param onClick - The function to be called when the button is clicked.
 */
type CloseButtonProps = {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
const CloseButton = ({ onClick }: CloseButtonProps) => {
    return (
        <div css={emotion}>
            <Button onClick={onClick}>
                <Icon svg={GLOBAL.svg.closeWindow} baseScale={1} />
            </Button>
        </div>
    );
};

export default CloseButton;
