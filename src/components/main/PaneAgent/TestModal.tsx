import { useModeUpdate } from "../../../contexts/ModeProvider/ModeContext";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import { useUser } from "../../../contexts/UserProvider/UserContext";
import Modal from "../../modal/Modal";

/**
 * Returns a React Modal component containing the Admin section.
 * @param align - The alignment parameter of the button, which opens the modal
 */
const TestModal = () => {
    const modeUpdate = useModeUpdate();
    const palette = usePalette();
    const user = useUser();

    return (
        <Modal
            button={{
                background: palette.two,
                align: "left",
                children: "Test",
                onClick: () => {
                    modeUpdate({ agent: "test" });
                },
                disabled: user.job !== "none",
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
