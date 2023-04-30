import { css } from "@emotion/react";
import { ChildrenProps } from "../../types";
import { GLOBAL } from "../../utils";

// Emotion styles
const emotion = css`
    position: sticky;
    width: 100%;
    padding: ${GLOBAL.padding};
    border-radius: 0, 0, ${GLOBAL.borderRadius} ${GLOBAL.borderRadius};
    border-top: 1px solid ${GLOBAL.colors.white};
    text-align: center;
`;

/**
 * Renders a modal header with the provided children.
 * @param {ChildrenProps} children - The children to be rendered inside the modal header.
 */
const ModalFooter = ({ children }: ChildrenProps) => {
    return <div css={emotion}>{children}</div>;
};

export default ModalFooter;
