import { css, SerializedStyles } from "@emotion/react";
import { useMemo, useCallback, useContext, useState, useEffect } from "react";
import {
    UserContext,
    UserUpdateContext,
    User,
    UserLogin,
} from "../../contexts/UserProvider/UserContext";
import { palettes } from "../../contexts/UserProvider/palette";
import useAPI from "../../hooks/useAPI";
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
const Login = ({ color = "inherit", align = "left" }: LoginProps) => {
    const user = useContext(UserContext);
    const palette = palettes[user.paletteName];
    const updateUser = useContext(UserUpdateContext);

    const [name, setName] = useState("");
    const [pwd, setPwd] = useState("");
    const [loginData, setLoginData] = useState<UserLogin | undefined>();
    const [message, setMessage] = useState("");

    // const { response, isLoading } = useAPI<User>(
    //     "post",
    //     "users/login",
    //     loginData
    // );

    // if (response) {
    //     if (typeof response.data === "object") {
    //         updateUser(response.data);
    //     } else if (typeof response.data === "string") {
    //         setMessage(response.data);
    //     } else console.log(response.error);
    // }

    const buttonText = useMemo(
        (): JSX.Element => <div css={makeEmotion(color)}>{user.name}</div>,
        [color, user]
    );

    return (
        <Modal
            button={{
                type: "whooshRotate",
                children: buttonText,
                align: align,
            }}
            modal={{
                width: "24em",
                backgroundColor: palette.background,
                color: palette.text,
            }}
        >
            Login section
            <form>
                <label htmlFor='name'>Name: </label>
                <input
                    id='name'
                    type='text'
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                <br />
                <label htmlFor='pwd'>Password : </label>
                <input
                    id='pwd'
                    type='text'
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                />
            </form>
            <Button onClick={() => setLoginData({ name, pwd })}>Submit</Button>
            <br />
            <p>{message}</p>
        </Modal>
    );
};

export default Login;
