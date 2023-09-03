import { css } from "@emotion/react";
import { ChildrenProps } from "../../types";
import { GLOBAL } from "../../utils";

// Emotion styles
const emotion = css`
    position: sticky;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: calc(${GLOBAL.padding} * 2);
    border-radius: 0, 0, ${GLOBAL.borderRadius} ${GLOBAL.borderRadius};
    border-top: 1px solid white;
    font-size: 0.9rem;
`;

/**
 * Modal footer.
 * @param children - to be rendered inside the modal header.
 */
const ModalFooter = ({ children }: ChildrenProps) => {
    return <footer css={emotion}>{children}</footer>;
};

export default ModalFooter;
