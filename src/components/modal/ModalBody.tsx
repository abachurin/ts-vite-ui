import { css } from "@emotion/react";
import { ChildrenProps } from "../../types";
import { GLOBAL } from "../../utils";

// Emotion styles
const emotion = css`
    flex: 1;
    width: 100%;
    padding-inline: ${GLOBAL.padding};
    padding-block: ${GLOBAL.padding};
    border-radius: ${GLOBAL.borderRadius};
    font-weight: 300;
    overflow: scroll;
`;

/**
 * Renders a scrollable modal body with the given children.
 * @param children - The children to render within the modal body.
 */
const ModalBody = ({ children }: ChildrenProps) => {
    return <div css={emotion}>{children}</div>;
};

export default ModalBody;
