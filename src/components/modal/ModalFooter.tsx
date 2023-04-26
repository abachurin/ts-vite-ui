import { css } from "@emotion/react";
import { ChildrenProps } from "../../types";
import { GLOBAL } from "../../utils";

const ModalHeader = ({children}: ChildrenProps) => {

    const emotion = css`
        position: sticky;
        width: 100%;
        margin-inline: 0 !important;
        padding-inline: ${GLOBAL.padding};
        padding-block: calc(${GLOBAL.padding});
        border-radius: 0, 0, ${GLOBAL.borderRadius} ${GLOBAL.borderRadius};
        border-top: 1px solid white;
        text-align: center;
    `
    return (
        <div css={emotion}>
            {children}
        </div>
    );
}

export default ModalHeader;