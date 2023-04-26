import { css } from "@emotion/react";
import { ChildrenProps } from "../../types";
import { GLOBAL } from "../../utils";

const ModalHeader = ({children}: ChildrenProps) => {

    const emotion = css`
        position: sticky;
        width: 100%;
        margin-inline: 0 !important;
        padding-inline: ${GLOBAL.padding};
        padding-block: calc(${GLOBAL.padding} * 1.4);
        border-radius: ${GLOBAL.borderRadius} ${GLOBAL.borderRadius} 0 0;
        border-bottom: 1px solid white;
    `
    return (
        <div css={emotion}>
            {children}
        </div>
    );
}

export default ModalHeader;