import { css } from "@emotion/react";
import { ReactNode, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import {
    useUser,
    useUserUpdate,
    LoginUser,
    User,
    defaultUser,
} from "../../contexts/UserProvider/UserContext";
import { palettes } from "../../contexts/UserProvider/palette";
import useAlertMessage from "../../hooks/useAlertMessage";
import { connectAPI } from "../../api/utils";
import { Alignment } from "../../types";
import { GLOBAL, SvgPaths, checkRe } from "../../utils";
import Modal from "../modal/Modal";
import ModalHeader from "../modal/ModalHeader";
import ModalBody from "../modal/ModalBody";
import ModalFooter from "../modal/ModalFooter";
import ButtonGroup from "../base/Button/ButtonGroup";
import Button from "../base/Button/Button";
import Icon from "../base/Icon/Icon";
import Input from "../base/Input";

// Emotion styles
const emotion = css`
    margin-block: ${GLOBAL.padding};
    display: flex;
    flex-direction: column;
    gap: ${GLOBAL.padding};
    & > * {
        flex: 1;
    }
    & > :last-of-type {
        margin-top: calc(${GLOBAL.padding} * 2);
        display: flex;
        justify-content: flex-end;
    }
`;
const initialMessage = "Enter Name and Password";

/**
 * Renders a login section with a button that displays the user's name and
 * opens a modal when clicked.
 * @param align - The alignment of the button.
 */
type LoginProps = {
    align?: Alignment;
};

const Login = ({ align = "left" }: LoginProps) => {
    const user = useUser();
    const palette = palettes[user.paletteName];
    const updateUser = useUserUpdate();

    const [name, setName] = useState<string | undefined>();
    const [pwd, setPwd] = useState<string | undefined>();

    const [message, createMessage] = useAlertMessage(initialMessage);

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
                    createMessage(`Welcome, ${result.name}`, "success");
                    updateUser(result);
                } else {
                    createMessage(error ?? "Unknown error", "error");
                }
            },
        }
    );

    const handleSubmit = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        action: "login" | "register" | "logout"
    ) => {
        e.preventDefault();
        if (action === "logout") {
            updateUser(defaultUser);
        } else if (name === undefined || pwd === undefined) {
            createMessage("Fields should be filled", "error");
        } else if (!checkRe(name) || !checkRe(pwd)) {
            createMessage(
                "Only letters, numerals, - and _ are allowed",
                "error"
            );
        } else {
            loginMutation.mutate({ name, pwd, action });
        }
        setName(undefined);
        setPwd(undefined);
    };

    const headerStyle = css`
        color: ${palette.text};
        text-align: center;
    `;

    const inputParameters = {
        backgroundColor: "white",
        labelColor1: palette.two,
        labelColor2: palette.one,
        controlColor: palette.three,
    };

    return (
        <Modal
            button={{
                type: "whooshRotate",
                children: user.name,
                align: align,
                color: palette.logo,
                fontSize: `${GLOBAL.logoScale}rem`,
            }}
            modal={{
                width: "22em",
                backgroundColor: palette.background,
                color: palette.text,
            }}
        >
            <ModalHeader>
                <h1 css={headerStyle}>Login / Register</h1>
            </ModalHeader>
            <ModalBody>
                <form css={emotion}>
                    <Input
                        {...inputParameters}
                        type='text'
                        label='Name'
                        initialValue={name}
                        onChange={(value) => setName(value as string)}
                    />
                    <Input
                        {...inputParameters}
                        type='text'
                        label='Password'
                        initialValue={pwd}
                        onChange={(value) => setPwd(value as string)}
                    />
                    <ButtonGroup height='2rem'>
                        <Button
                            type='clickPress'
                            backgroundColor={palette.one}
                            color={palette.background}
                            onClick={(e) => handleSubmit(e, "login")}
                        >
                            Login
                        </Button>
                        <Button
                            type='clickPress'
                            backgroundColor={palette.two}
                            color={palette.background}
                            onClick={(e) => handleSubmit(e, "register")}
                        >
                            Register
                        </Button>
                        <Button
                            type='clickPress'
                            align='right'
                            backgroundColor={palette.three}
                            color={palette.background}
                            disabled={user.name === "Login"}
                            onClick={(e) => handleSubmit(e, "logout")}
                        >
                            <Icon svg={SvgPaths.logout} />
                        </Button>
                    </ButtonGroup>
                </form>
            </ModalBody>
            <ModalFooter>
                {loginMutation.isLoading ? "Authorization ..." : message}
            </ModalFooter>
        </Modal>
    );
};

export default Login;
