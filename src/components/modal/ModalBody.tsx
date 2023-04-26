import { css } from "@emotion/react";
import { ChildrenProps } from "../../types";
import { GLOBAL } from "../../utils";

/**
 * Renders a scrollable modal body with the given children.
 *
 * @param children - The children to render within the modal body.
 */
const ModalBody = ({children}: ChildrenProps) => {

    const emotion = css`
        flex: 1;
        width: 100%;
        margin-inline: 0 !important;
        padding: ${GLOBAL.padding};
        border-radius: ${GLOBAL.borderRadius};
        overflow: scroll;
    `
    return (
        <div css={emotion}>
            {children}
        </div>
    );
}

export default ModalBody;