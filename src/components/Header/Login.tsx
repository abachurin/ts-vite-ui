import { css, SerializedStyles } from "@emotion/react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
    useUser,
    useUserUpdate,
    LoginUser,
    User,
} from "../../contexts/UserProvider/UserContext";
import { palettes } from "../../contexts/UserProvider/palette";
import { connectAPI } from "../../api/utils";
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
    const user = useUser();
    const palette = palettes[user.paletteName];
    const updateUser = useUserUpdate();

    const [name, setName] = useState("");
    const [pwd, setPwd] = useState("");
    const [message, setMessage] = useState("");

    const loginMutation = useMutation(
        (data: LoginUser) =>
            connectAPI<LoginUser, User>({
                method: "post",
                endpoint: "/users/login",
                data: data,
            }),
        {
            onSuccess: ({ result, error }) => {
                if (result !== undefined) {
                    setMessage(`Welcome, ${result.name}`);
                    updateUser(result);
                } else {
                    setMessage(error ?? "Unknown error");
                }
            },
        }
    );

    const handleSubmit = (action: "login" | "register") => {
        loginMutation.mutate({ name, pwd, action });
    };

    return (
        <Modal
            button={{
                type: "whooshRotate",
                children: "Login",
                align: align,
                color: color,
                fontSize: `${GLOBAL.logoScale}rem`,
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
            <Button onClick={() => handleSubmit("login")}>Submit</Button>
            <br />
            <p>{message}</p>
            {loginMutation.isLoading && <div>Loading...</div>}
        </Modal>
    );
};

export default Login;
