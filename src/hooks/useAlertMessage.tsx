import { css } from "@emotion/react";
import { useState, useRef } from "react";
import { palettes } from "../contexts/UserProvider/palette";
import { useUser } from "../contexts/UserProvider/UserContext";
import { GLOBAL } from "../utils";

const useAlertMessage = (
    initialMessage: string
): [
    React.ReactNode,
    (text?: string, type?: "error" | "success", duration?: number) => void
] => {
    const [message, setMessage] = useState<React.ReactNode>(initialMessage);
    const timeoutId = useRef<NodeJS.Timeout>();
    const user = useUser();
    const palette = palettes[user.paletteName];

    const createMessage = (
        text = "",
        type: "error" | "success" = "success",
        duration: number = GLOBAL.messageDuration
    ) => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
        setMessage(
            <div
                css={css`
                    color: ${type === "success"
                        ? palette.success
                        : palette.error};
                `}
            >
                {text}
            </div>
        );
        timeoutId.current = setTimeout(() => {
            setMessage(initialMessage);
        }, duration);
    };

    return [message, createMessage];
};

export default useAlertMessage;
