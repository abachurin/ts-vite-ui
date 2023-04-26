import { css } from "@emotion/react";
import Button from "./Button";
import Icon from "./Icon";
import { GLOBAL } from "../../utils";

interface CloseButtonProps {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Renders a Close button component with an onClick event handler.
 *
 * @param onClick - The function to be called when the button is clicked.
 */
const CloseButton = ({ onClick }: CloseButtonProps) => {
    const emotion = css`
        position: absolute;
        right: 0;
        top: 0;
        background-color: inherit;
        color: inherit;
        border-radius: ${GLOBAL.borderRadius};
        z-index: 300;
    `;

    return (
        <div css={emotion}>
            <Button onClick={onClick}>
                <Icon svg={GLOBAL.svg.closeWindow} baseScale={1} />
            </Button>
        </div>
    );
};

export default CloseButton;
