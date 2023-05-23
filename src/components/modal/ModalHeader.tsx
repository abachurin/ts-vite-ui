import { css } from "@emotion/react";
import { ChildrenProps } from "../../types";
import { GLOBAL } from "../../utils";
import CloseButton from "../base/Button/CloseButton";

// Emotion styles
const emotion = css`
    position: sticky;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: ${GLOBAL.padding};
    padding-left: calc(${GLOBAL.padding} * 2);
    border-radius: ${GLOBAL.borderRadius} ${GLOBAL.borderRadius} 0 0;
    border-bottom: 1px solid white;
    & > * {
        align-items: center;
    }
`;

/**
 * Renders a modal header component with children.
 * @param {ChildrenProps} children - The children to be rendered in the modal header.
 */
const ModalHeader = ({ children }: ChildrenProps) => {
    return (
        <div css={emotion}>
            {children}
            <CloseButton />
        </div>
    );
};

export default ModalHeader;
