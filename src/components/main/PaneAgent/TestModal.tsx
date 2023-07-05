import { useState } from "react";
import { connectAPI } from "../../../api/utils";
import { useModeUpdate } from "../../../contexts/ModeProvider/ModeContext";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import { useUser } from "../../../contexts/UserProvider/UserContext";
import useAlertMessage from "../../../hooks/useAlertMessage";
import useAnyRunningJob from "../../../hooks/useAnyJob";
import { Agent, ItemListRequest, ItemListResponse } from "../../../types";
import Modal from "../../modal/Modal";

/**
 * Returns a React Modal component containing the Admin section.
 * @param align - The alignment parameter of the button, which opens the modal
 */
const TestModal = () => {
    const modeUpdate = useModeUpdate();
    const palette = usePalette();
    const user = useUser();
    const anyJob = useAnyRunningJob();

    const [message, createMessage] = useAlertMessage("");
    const [loading, setLoading] = useState(false);

    const [agents, setAgents] = useState<Agent[]>([]);

    // const onOpen = async () => {
    //     const { result, error } = await connectAPI<
    //         ItemListRequest,
    //         AgentListResponse
    //     >({
    //         method: "post",
    //         endpoint: "agents/list",
    //         data: { userName: user.name, scope: "all" },
    //     });
    //     if (error) {
    //         createMessage(error, "error");
    //     } else {
    //         if (result === undefined || result.status !== "ok") {
    //             createMessage(result?.status ?? "Something is wrong!", "error");
    //         } else setAgents([]);
    //     }
    //     setLoading(false);

    //     modeUpdate({ agent: "test" });
    // };

    // const handleTest = async () => {
    // const [validated, change] = validateTrainingParams(values);
    // setValues((prevValues) => ({ ...prevValues, ...validated }));
    // if (change) {
    //     createMessage(
    //         "Some parameters are invalid or undefined. Please follow the instructions.",
    //         "error"
    //     );
    // } else {
    //     setLoading(true);
    //     createMessage("Processing Job ...");
    //     const { result, error } = await connectAPI<AgentTraining, string>({
    //         method: "post",
    //         endpoint: `/jobs/train`,
    //         data: { ...values, user: user.name },
    //     });
    //     if (error) {
    //         createMessage(error, "error");
    //     } else {
    //         if (result !== "ok") {
    //             createMessage(result, "error");
    //         } else {
    //             const message = values.isNew
    //                 ? `Agent created${
    //                       (values.episodes as number) > 0
    //                           ? ", training commenced, follow the logs"
    //                           : ""
    //                   }`
    //                 : "Training resumed, follow the logs";
    //             createMessage(message, "success");
    //             modeUpdate({ agent: "train" });
    //             setTimeout(() => {
    //                 simulateCloseModalClick();
    //             }, 3000);
    //         }
    //     }
    //     setLoading(false);
    // }
    // };

    return (
        <Modal
            button={{
                background: palette.two,
                align: "left",
                children: "Test",
                legend: "Only for registered users, and when no Job is running",
                // onClick: onOpen,
                disabled: anyJob,
            }}
            modal={{
                width: "200px",
                backgroundColor: palette.background,
                color: palette.text,
            }}
        >
            Test Agent
        </Modal>
    );
};

export default TestModal;
