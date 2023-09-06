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
import { User } from "../../types";
import {
    GLOBAL,
    SvgPaths,
    checkRe,
    simulateCloseModalClick,
    namingRule,
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

/**
 * Login section with a button that displays the user's name.
 */
const Login = () => {
    const userName = useUserName();
    const palette = usePalette();
    const updateUser = useUserUpdate();
    const defaultMode = useModeStore((state) => state.defaultMode);
    const { newGame, setPaused, setWatchingNow } = useGameStore();
    const setLogs = useLogsStore((state) => state.setLogs);

    const [confirmDelete, setConfirmDelete] = useState(false);

    const [name, setName] = useState("");
    const [pwd, setPwd] = useState("");

    const [message, createMessage] = useAlertMessage("Enter Name and Password");
    const [loading, setLoading] = useState(false);

    const finalizeLogin = (newUser: User, closeAfter = true): void => {
        setLogs([]);
        defaultMode();
        setWatchingNow(false);
        setPaused(true);
        newGame();
        updateUser(newUser);
        if (closeAfter)
            setTimeout(() => {
                simulateCloseModalClick();
            }, 2000);
    };

    const handleSubmit = async (action: UserLoginAction) => {
        if (action === "logout") {
            finalizeLogin(defaultUser, false);
        } else if (name === "" || pwd === "") {
            createMessage("Both fields should be filled", "error");
        } else if (action == "register" && (!checkRe(name) || !checkRe(pwd))) {
            createMessage(
                `Letters, numerals, dash, underscore, max ${GLOBAL.maxNameLength} chars`,
                "error"
            );
        } else if (
            (action == "register" || action == "login") &&
            name === userName
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
                        persistAs='login-name'
                        initialValue={name}
                        placeholder={namingRule}
                        onChange={(value) => {
                            setName(value);
                        }}
                    />
                    <Input
                        {...inputParameters}
                        type='text'
                        label='Password'
                        persistAs='login-pwd'
                        initialValue={pwd}
                        placeholder={namingRule}
                        onChange={(value) => setPwd(value)}
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
                            onClick={() => handleSubmit("logout")}
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
                    handleSubmit("delete");
                }}
                onCancel={() => setConfirmDelete(false)}
            />
        </Modal>
    );
};

export default Login;
