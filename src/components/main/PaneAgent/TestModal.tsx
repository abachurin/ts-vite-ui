import { useModeUpdate } from "../../../contexts/ModeProvider/ModeContext";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import { useUser } from "../../../contexts/UserProvider/UserContext";
import useJobDescription from "../../../hooks/useJobDescription";
import Modal from "../../modal/Modal";

/**
 * Returns a React Modal component containing the Admin section.
 * @param align - The alignment parameter of the button, which opens the modal
 */
const TestModal = () => {
    const modeUpdate = useModeUpdate();
    const palette = usePalette();
    const user = useUser();
    const job = useJobDescription(user.name);

    return (
        <Modal
            button={{
                background: palette.two,
                align: "left",
                children: "Test",
                legend: "Only for registered users",
                onClick: () => {
                    modeUpdate({ agent: "test" });
                },
                disabled: job !== null || user.name === "Login",
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
