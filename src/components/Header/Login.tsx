import { css } from "@emotion/react";
import { useState } from "react";
import { useLogsStore } from "../../store/logsStore";
import {
    useUser,
    usePalette,
    useUserUpdate,
    defaultUser,
} from "../../contexts/UserProvider/UserContext";
import useAlertMessage from "../../hooks/useAlertMessage";
import { connectAPI } from "../../api/utils";
import {
    Alignment,
    User,
    UserLogin,
    UserLoginAction,
    LoginResponse,
} from "../../types";
import {
    GLOBAL,
    SvgPaths,
    checkRe,
    simulateCloseModalClick,
} from "../../utils";
import Modal from "../modal/Modal";
import ModalHeader from "../modal/ModalHeader";
import ModalBody from "../modal/ModalBody";
import ModalFooter from "../modal/ModalFooter";
import ButtonGroup from "../base/Button/ButtonGroup";
import Button from "../base/Button/Button";
import Icon from "../base/Icon/Icon";
import Input from "../base/Input";
import ConfirmDialog from "../base/ConfirmDialog";

// Emotion styles
const emotion = css`
    margin-block: ${GLOBAL.padding};
    padding-inline: ${GLOBAL.padding};
    display: flex;
    flex-direction: column;
    gap: calc(${GLOBAL.padding} * 2);
    & > * {
        flex: 1;
    }
    & > :last-of-type {
        margin-top: calc(${GLOBAL.padding} * 2);
        margin-left: auto;
    }
`;

const successMessage = (action: UserLoginAction, userName: string): string =>
    action === "login"
        ? `Welcome back, ${userName}!`
        : action === "register"
        ? `Welcome ${userName}!`
        : `${userName} deleted`;
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
    const setLogs = useLogsStore((state) => state.setLogs);
    const palette = usePalette();
    const updateUser = useUserUpdate();
    const [confirmDelete, setConfirmDelete] = useState(false);

    const [name, setName] = useState<string | undefined>();
    const [pwd, setPwd] = useState<string | undefined>();

    const [message, createMessage] = useAlertMessage(initialMessage);
    const [loading, setLoading] = useState(false);

    const finalizeLogin = (update: User): void => {
        setLogs([]);
        updateUser(update);
        setTimeout(() => {
            simulateCloseModalClick();
        }, 1000);
    };

    const handleSubmit = async (
        e: React.MouseEvent<HTMLButtonElement>,
        action: UserLoginAction
    ) => {
        e.preventDefault();
        if (action === "logout") {
            setLogs([]);
            updateUser(defaultUser);
        } else if (name === undefined || pwd === undefined) {
            createMessage("Both fields should be filled", "error");
        } else if (action == "register" && (!checkRe(name) || !checkRe(pwd))) {
            createMessage(
                `Letters, numerals, dash, underscore, 1-${GLOBAL.maxNameLength} chars`,
                "error"
            );
        } else {
            setLoading(true);
            createMessage("Authorization ...", "success");
            const { result, error } = await connectAPI<
                UserLogin,
                LoginResponse
            >({
                method: action === "delete" ? "delete" : "post",
                endpoint: `/users/${action}`,
                data: { name, pwd },
            });
            if (result !== undefined) {
                if (result.status !== "ok") {
                    createMessage(result.status, "error");
                } else {
                    const newUser =
                        action === "delete"
                            ? defaultUser
                            : (result.content as User);
                    createMessage(
                        successMessage(
                            action,
                            action === "delete"
                                ? (name as string)
                                : newUser.name
                        ),
                        "success"
                    );
                    finalizeLogin(newUser);
                }
            } else {
                createMessage(error ?? "Unknown error", "error");
            }
            setLoading(false);
        }
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

    const buttonText =
        user.name === "Login" ? (
            <Icon svg={SvgPaths.login} rescaleFactor={1.2} />
        ) : (
            <div
                css={css`
                    text-transform: none;
                `}
            >
                {user.name}
            </div>
        );

    return (
        <Modal
            button={{
                type: "whooshRotate",
                children: buttonText,
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
                        persistAs='login-name'
                        initialValue={name}
                        onChange={(value) => setName(value as string)}
                    />
                    <Input
                        {...inputParameters}
                        type='text'
                        label='Password'
                        persistAs='login-pwd'
                        initialValue={pwd}
                        onChange={(value) => setPwd(value as string)}
                    />
                    <ButtonGroup height='2rem'>
                        <Button
                            type='clickPress'
                            background={palette.one}
                            color={palette.background}
                            disabled={loading}
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                                handleSubmit(e, "login")
                            }
                        >
                            Login
                        </Button>
                        <Button
                            type='clickPress'
                            background={palette.two}
                            color={palette.background}
                            disabled={loading}
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                                handleSubmit(e, "register")
                            }
                        >
                            Register
                        </Button>
                        <Button
                            type='clickPress'
                            background={palette.four}
                            color={palette.background}
                            disabled={loading || user.name === "Login"}
                            onClick={(e) => {
                                e.preventDefault();
                                setConfirmDelete(true);
                            }}
                        >
                            Delete me
                        </Button>
                        <Button
                            type='clickPress'
                            align='right'
                            background={palette.three}
                            color={palette.background}
                            disabled={loading || user.name === "Login"}
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                                handleSubmit(e, "logout")
                            }
                        >
                            <Icon svg={SvgPaths.logout} />
                        </Button>
                    </ButtonGroup>
                </form>
            </ModalBody>
            <ModalFooter>{message}</ModalFooter>
            <ConfirmDialog
                isOpen={confirmDelete}
                message={`Are you sure you want to delete ${name}?`}
                onConfirm={(e) => {
                    setConfirmDelete(false);
                    handleSubmit(
                        e as React.MouseEvent<HTMLButtonElement>,
                        "delete"
                    );
                }}
                onCancel={() => setConfirmDelete(false)}
            />
        </Modal>
    );
};

export default Login;
