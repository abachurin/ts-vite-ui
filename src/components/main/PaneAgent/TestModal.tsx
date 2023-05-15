import { useModeUpdate } from "../../../contexts/ModeProvider/ModeContext";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import Modal from "../../modal/Modal";

/**
 * Returns a React Modal component containing the Admin section.
 * @param align - The alignment parameter of the button, which opens the modal
 */
const TestModal = () => {
    const modeUpdate = useModeUpdate();
    const palette = usePalette();

    return (
        <Modal
            button={{
                backgroundColor: palette.two,
                align: "left",
                children: "Test",
                onClick: () => {
                    modeUpdate({ agent: "test" });
                },
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
