import { css } from "@emotion/react";
import { useState, useRef, useCallback } from "react";
import { usePalette } from "../contexts/UserProvider/UserContext";
import { GLOBAL } from "../utils/utils";

/**
 * Hook for displaying text message of suitable color.
 * @param initialMessage - initial alert message
 * @return A tuple containing the current alert message and a function to set a new alert message.
 */
const useAlertMessage = (
    initialMessage = ""
): {
    message: React.ReactNode;
    createMessage: (
        text?: string,
        type?: "error" | "success",
        duration?: number
    ) => void;
} => {
    const [message, setMessage] = useState<React.ReactNode>(initialMessage);
    const timeoutId = useRef<NodeJS.Timeout>();
    const palette = usePalette();

    const createMessage = useCallback(
        (
            text = "",
            type: "error" | "success" = "success",
            duration = GLOBAL.messageDuration
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
        },
        [initialMessage, palette.error, palette.success]
    );
    // const createMessage = (
    //     text = "",
    //     type: "error" | "success" = "success",
    //     duration = GLOBAL.messageDuration
    // ) => {
    //     if (timeoutId.current) {
    //         clearTimeout(timeoutId.current);
    //     }
    //     setMessage(
    //         text ? (
    //             <div
    //                 css={css`
    //                     color: ${type === "success"
    //                         ? palette.success
    //                         : palette.error};
    //                     font-weight: 500;
    //                 `}
    //             >
    //                 {text}
    //             </div>
    //         ) : null
    //     );
    //     timeoutId.current = setTimeout(() => {
    //         setMessage(initialMessage);
    //     }, duration);
    // };

    return { message, createMessage };
};

export default useAlertMessage;
