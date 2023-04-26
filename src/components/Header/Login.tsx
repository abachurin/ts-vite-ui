import { css } from "@emotion/react";
import { useMemo, useCallback, useContext } from "react";
import { GLOBAL } from "../../utils";
import {
    UserContext,
    UserUpdateContext,
} from "../../contexts/UserProvider/UserContext";
import Modal from "../modal/Modal";
import Button from "../base/Button";
import { Alignment } from "../../types";

type LoginProps = {
    color?: string;
    align?: Alignment;
};

/**
 * Renders a login section with a button that displays the user's name and
 * opens a modal when clicked.
 *
 * @param color - The color of the user's name.
 * @param align - The alignment of the button.
 */
const Login = ({ color, align }: LoginProps) => {
    const user = useContext(UserContext);
    const updateUser = useContext(UserUpdateContext);

    const openLogin = useCallback((): void => {
        updateUser({
            name: "Loki",
            level: GLOBAL.userLevel.user,
            animationInverseSpeed: 2,
            animate: true,
        });
    }, [updateUser]);

    const emotion = css`
        font-size: ${GLOBAL.logoScale}rem;
        color: ${color};
        // margin-right: 0.2em;
        text-align: center;
    `;

    const buttonChildren = useMemo(
        (): JSX.Element => <div css={emotion}>{user.name}</div>,
        [emotion, user]
    );

    return (
        <Modal
            button={{
                children: buttonChildren,
                align: align,
            }}
        >
            Login section
            <Button onClick={openLogin} alsoCloseModal={true}>
                Submit
            </Button>
        </Modal>
    );
};

export default Login;
