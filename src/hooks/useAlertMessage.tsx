import { css } from "@emotion/react";
import { useState, useRef } from "react";
import { usePalette } from "../contexts/UserProvider/UserContext";
import { GLOBAL } from "../utils";

/**
 * Hook for displaying text message of suitable color.
 * @param initialMessage - initial alert message
 * @return A tuple containing the current alert message and a function to set a new alert message.
 */
const useAlertMessage = (
    initialMessage = ""
): [
    React.ReactNode,
    (text?: string, type?: "error" | "success", duration?: number) => void
] => {
    const [message, setMessage] = useState<React.ReactNode>(initialMessage);
    const timeoutId = useRef<NodeJS.Timeout>();
    const palette = usePalette();

    const createMessage = (
        text = "",
        type: "error" | "success" = "success",
        duration: number = GLOBAL.messageDuration
    ) => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
        setMessage(
            text ? (
                <div
                    css={css`
                        color: ${type === "success"
                            ? palette.success
                            : palette.error};
                        font-weight: 500;
                    `}
                >
                    {text}
                </div>
            ) : null
        );
        timeoutId.current = setTimeout(() => {
            setMessage(initialMessage);
        }, duration);
    };

    return [message, createMessage];
};

export default useAlertMessage;
