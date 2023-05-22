import { css, SerializedStyles } from "@emotion/react";
import { ChildrenProps } from "../../types";
import { GLOBAL } from "../../utils";

// Emotion styles
const makeEmotion = (overflow: string): SerializedStyles => css`
    flex: 1;
    width: 100%;
    height: "auto";
    padding-inline: ${GLOBAL.padding};
    padding-block: ${GLOBAL.padding};
    border-radius: ${GLOBAL.borderRadius};
    font-weight: 300;
    overflow: ${overflow};
`;

/**
 * Renders a scrollable modal body with the given children.
 * @param children - The children to render within the modal body.
 */
interface ModalBodyProps extends ChildrenProps {
    overflow?: string;
}
const ModalBody = ({ overflow = "scroll", children }: ModalBodyProps) => {
    const emotion = makeEmotion(overflow);

    return <div css={emotion}>{children}</div>;
};

export default ModalBody;
