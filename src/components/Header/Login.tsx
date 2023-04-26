import { css } from "@emotion/react";
import { useMemo, useCallback } from "react";
import { GLOBAL } from "../../utils";
import { useUser, useUpdateUser } from "../../contexts/UserContext";
import Modal from "../modal/Modal"
import Button from "../base/Button";
import { Alignment } from "../../types";

type LoginProps = {
    color?: string;
    align?: Alignment;
}

/**
 * Renders a login section with a button that displays the user's name and
 * opens a modal when clicked.
 *
 * @param color - The color of the user's name.
 * @param align - The alignment of the button.
 */
const Login = ({ color, align }: LoginProps) => {
    const user = useUser()
    const updateUser = useUpdateUser();

    const openLogin = useCallback((): void => {
        updateUser({
            name: "Loki",
            level: GLOBAL.level.user,
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
        (): JSX.Element => (
            <div css={emotion}>
                {user.name}
            </div>
        ), [emotion, user]
    )

    return (
        <Modal
        button={{
            children: buttonChildren,
            align: align
        }}
        >
        Login section
        <Button onClick={openLogin} alsoCloseModal={true}>
            Submit
        </Button>
        </Modal>
    );
}

export default Login;
