import { css } from "@emotion/react";
import { useState, useCallback } from "react";
import useModeStore from "../../store/modeStore";
import useGameStore from "../../store/gameStore";
import {
    useUserName,
    usePalette,
    useUserUpdate,
    defaultUser,
} from "../../contexts/UserProvider/UserContext";
import useAlertMessage from "../../hooks/useAlertMessage";
import { connectAPI } from "../../api/requests";
import { User } from "../../types";
import {
    GLOBAL,
    SvgPaths,
    checkRe,
    simulateCloseModalClick,
    namingRule,
} from "../../utils/utils";
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

/**
 * Login section with a button that displays the user"s name.
 */
const Login = () => {
    const userName = useUserName();
    const palette = usePalette();
    const updateUser = useUserUpdate();

    const defaultMode = useModeStore((state) => state.defaultMode);

    const newGame = useGameStore((state) => state.newGame);
    const setPaused = useGameStore((state) => state.setPaused);
    const setWatchingNow = useGameStore((state) => state.setWatchingNow);

    const [confirmDelete, setConfirmDelete] = useState(false);

    const [name, setName] = useState("");
    const [pwd, setPwd] = useState("");
    const handleName = useCallback((value: string) => setName(value), []);
    const handlePwd = useCallback((value: string) => setPwd(value), []);

    const { message, createMessage } = useAlertMessage(
        "Enter Name and Password"
    );
    const [loading, setLoading] = useState(false);

    // After successful login action
    const finalizeLogin = useCallback(
        (newUser: User, closeAfter = true): void => {
            defaultMode();
            setWatchingNow(false);
            setPaused(true);
            newGame();
            updateUser(newUser);
            if (closeAfter)
                setTimeout(() => {
                    simulateCloseModalClick();
                }, 1500);
        },
        [defaultMode, newGame, setPaused, setWatchingNow, updateUser]
    );

    // Go login
    const handleSubmit = useCallback(
        async (action: UserLoginAction, newName: string, newPwd: string) => {
            if (action === "logout") {
                finalizeLogin(defaultUser, false);
            } else if (!(newName && newPwd)) {
                createMessage("Both fields should be filled", "error");
            } else if (
                action == "register" &&
                (!checkRe(newName) || !checkRe(newPwd))
            ) {
                createMessage(
                    `Letters, numerals, dash, underscore, max ${GLOBAL.maxNameLength} chars`,
                    "error"
                );
            } else if (
                (action == "register" || action == "login") &&
                newName === userName
            ) {
                createMessage("You are already logged in!", "error");
            } else {
                setLoading(true);
                createMessage("Authorization ...", "success");
                const { result, error } = await connectAPI<
                    UserLogin,
                    LoginResponse
                >({
                    method: action === "delete" ? "delete" : "post",
                    endpoint: `/users/${action}`,
                    data: { name: newName, pwd: newPwd },
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
                                action === "delete" ? newName : newUser.name
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
        },
        [createMessage, finalizeLogin, userName]
    );

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
                align: "right",
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
                <main css={emotion}>
                    <Input
                        {...inputParameters}
                        type='text'
                        label='Name'
                        persistAs={`${userName}_login-name`}
                        placeholder={namingRule}
                        onChange={handleName}
                    />
                    <Input
                        {...inputParameters}
                        type='text'
                        label='Password'
                        persistAs={`${userName}_login-pwd`}
                        placeholder={namingRule}
                        onChange={handlePwd}
                    />
                    <ButtonGroup height='2rem'>
                        <Button
                            type='clickPress'
                            background={palette.one}
                            color={palette.background}
                            disabled={loading}
                            onClick={() => handleSubmit("login", name, pwd)}
                        >
                            Login
                        </Button>
                        <Button
                            type='clickPress'
                            background={palette.two}
                            color={palette.background}
                            disabled={loading}
                            onClick={() => handleSubmit("register", name, pwd)}
                        >
                            Register
                        </Button>
                        <Button
                            type='clickPress'
                            background={palette.four}
                            color={palette.background}
                            disabled={loading || userName === "Login"}
                            onClick={() => setConfirmDelete(true)}
                        >
                            Delete me
                        </Button>
                        <Button
                            type='clickPress'
                            align='right'
                            background={palette.three}
                            color={palette.background}
                            disabled={loading || userName === "Login"}
                            onClick={() => handleSubmit("logout", name, pwd)}
                        >
                            <Icon svg={SvgPaths.logout} />
                        </Button>
                    </ButtonGroup>
                </main>
            </ModalBody>
            <ModalFooter>{message}</ModalFooter>
            <ConfirmDialog
                isOpen={confirmDelete}
                message={`Are you sure you want to delete ${name}?`}
                onConfirm={() => {
                    setConfirmDelete(false);
                    handleSubmit("delete", name, pwd);
                }}
                onCancel={() => setConfirmDelete(false)}
            />
        </Modal>
    );
};

export default Login;
