import { css } from "@emotion/react";

import { GLOBAL } from "../utils/utils";
import Pane from "../components/main/Pane";
import Dropdown from "../components/base/Dropdown";

// Emotion styles
const emotion = css`
    display: flex;
    flex: 1;
    width: 100%;
    flex-direction: column;
    gap: ${GLOBAL.padding};
    & > section {
        flex: 1;
        display: flex;
    }
    & > section > * {
        flex: 1;
    }
`;

const AdminManage = () => {
    return (
        <Pane>
            <div css={emotion}>
                <section>
                    <Dropdown
                        optionValues={["a", "b", "c"]}
                        onChange={(value) => console.log(value)}
                    />
                    <Dropdown
                        optionValues={["a", "b", "c"]}
                        onChange={(value) => console.log(value)}
                    />
                </section>
                <section>
                    <Dropdown
                        optionValues={["a", "b", "c"]}
                        onChange={(value) => console.log(value)}
                    />
                    <Dropdown
                        optionValues={["a", "b", "c"]}
                        onChange={(value) => console.log(value)}
                    />
                </section>
            </div>
        </Pane>
    );
};

export default AdminManage;
