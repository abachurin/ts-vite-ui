import { css } from "@emotion/react";
import { ChildrenProps } from "../../types";
import { GLOBAL } from "../../utils";

// Emotion styles
const emotion = css`
    position: sticky;
    width: 100%;
    margin-inline: 0 !important;
    font-size: 1.2rem;
    padding: ${GLOBAL.padding};
    border-radius: ${GLOBAL.borderRadius} ${GLOBAL.borderRadius} 0 0;
    border-bottom: 1px solid white;
`;

/**
 * Renders a modal header component with children.
 * @param {ChildrenProps} children - The children to be rendered in the modal header.
 */
const ModalHeader = ({ children }: ChildrenProps) => {
    return <div css={emotion}>{children}</div>;
};

export default ModalHeader;
