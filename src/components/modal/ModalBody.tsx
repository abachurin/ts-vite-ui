import { css } from "@emotion/react";
import { useMemo } from "react";
import { ChildrenProps } from "../../types";
import { GLOBAL } from "../../utils/utils";

// Emotion styles
const makeEmotion = (overflow: string) => css`
    flex: 1;
    width: 100%;
    height: "auto";
    padding-inline: ${GLOBAL.padding};
    padding-block: ${GLOBAL.padding};
    border-radius: ${GLOBAL.borderRadius};
    font-weight: 300;
    overflow: ${overflow};
    z-index: 2;
`;

/**
 * Modal body
 * @param children - to be rendered within the modal body
 * @param overflow - CSS overflow property, "scroll" by default
 */
interface ModalBodyProps extends ChildrenProps {
    overflow?: string;
}
const ModalBody = ({ overflow = "scroll", children }: ModalBodyProps) => {
    const emotion = useMemo(() => makeEmotion(overflow), [overflow]);

    return <div css={emotion}>{children}</div>;
};

export default ModalBody;
