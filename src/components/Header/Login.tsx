import { css, SerializedStyles } from "@emotion/react";
import { useMemo, useCallback, useContext } from "react";
import {
    UserContext,
    UserUpdateContext,
} from "../../contexts/UserProvider/UserContext";
import { Alignment } from "../../types";
import { GLOBAL } from "../../utils";
import Modal from "../modal/Modal";
import Button from "../base/Button/Button";

// Emotion styles
const makeEmotion = (color: string): SerializedStyles => css`
    font-size: ${GLOBAL.logoScale}rem;
    color: ${color};
    text-align: center;
`;

/**
 * Renders a login section with a button that displays the user's name and
 * opens a modal when clicked.
 * @param color - The color of the user's name.
 * @param align - The alignment of the button.
 */
type LoginProps = {
    color?: string;
    align?: Alignment;
};
const Login = ({ color = GLOBAL.colors.neon, align = "left" }: LoginProps) => {
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

    const buttonChildren = useMemo(
        (): JSX.Element => <div css={makeEmotion(color)}>{user.name}</div>,
        [color, user]
    );

    return (
        <Modal
            button={{
                type: "whooshRotate",
                children: buttonChildren,
                align: align,
            }}
        >
            Login section
            <Button onClick={openLogin} toggleModal={false}>
                Submit
            </Button>
        </Modal>
    );
};

export default Login;
