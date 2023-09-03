import { css } from "@emotion/react";
import { useState } from "react";
import useModeStore from "../../store/modeStore";
import useLogsStore from "../../store/logsStore";
import useGameStore from "../../store/gameStore";
import {
    useUserName,
    usePalette,
    useUserUpdate,
    defaultUser,
} from "../../contexts/UserProvider/UserContext";
import useAlertMessage from "../../hooks/useAlertMessage";
import { connectAPI } from "../../api/requests";
import { Alignment, User } from "../../types";
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

// Helper functions
type UserLoginAction = "login" | "register" | "delete" | "logout";
type UserLogin = {
    name: string;
    pwd: string;
};
type LoginResponse = {
    status: string;
    content: User | undefined;
};

const successMessage = (action: UserLoginAction, userName: string): string =>
    action === "login"
        ? `Welcome back, ${userName}!`
        : action === "register"
        ? `Welcome ${userName}!`
        : `${userName} deleted`;

const initialMessage = "Enter Name and Password";

/**
 * Login section with a button that displays the user's name.
 * @param align - alignment of the Login button
 */
type LoginProps = {
    align?: Alignment;
};

const Login = ({ align = "left" }: LoginProps) => {
    const userName = useUserName();
    const palette = usePalette();
    const updateUser = useUserUpdate();
    const defaultMode = useModeStore((state) => state.defaultMode);
    const { newGame, setPaused, setWatchingNow } = useGameStore();
    const setLogs = useLogsStore((state) => state.setLogs);

    const [confirmDelete, setConfirmDelete] = useState(false);

    const [name, setName] = useState<string | undefined>();
    const [pwd, setPwd] = useState<string | undefined>();

    const [message, createMessage] = useAlertMessage(initialMessage);
    const [loading, setLoading] = useState(false);

    const finalizeLogin = (newUser: User): void => {
        setLogs([]);
        defaultMode();
        setWatchingNow(false);
        setPaused(true);
        newGame();
        updateUser(newUser);
        setTimeout(() => {
            simulateCloseModalClick();
        }, 2000);
    };

    const handleSubmit = async (action: UserLoginAction) => {
        if (action === "logout") {
            finalizeLogin(defaultUser);
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
        userName === "Login" ? (
            <Icon svg={SvgPaths.login} rescaleFactor={1.2} />
        ) : (
            <div
                css={css`
                    text-transform: none;
                `}
            >
                {userName}
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
                            onClick={() => handleSubmit("login")}
                        >
                            Login
                        </Button>
                        <Button
                            type='clickPress'
                            background={palette.two}
                            color={palette.background}
                            disabled={loading}
                            onClick={() => handleSubmit("register")}
                        >
                            Register
                        </Button>
                        <Button
                            type='clickPress'
                            background={palette.four}
                            color={palette.background}
                            disabled={loading || userName === "Login"}
                            onClick={() => {
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
                            disabled={loading || userName === "Login"}
                            onClick={() => handleSubmit("logout")}
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
                onConfirm={() => {
                    setConfirmDelete(false);
                    handleSubmit("delete");
                }}
                onCancel={() => setConfirmDelete(false)}
            />
        </Modal>
    );
};

export default Login;
