import { useModeUpdate } from "../../contexts/ModeProvider/ModeContext";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import Modal from "../modal/Modal";
import { GLOBAL } from "../../utils";

/**
 * Returns a React Modal component containing the Admin section.
 * @param align - The alignment parameter of the button, which opens the modal
 */
const TrainModal = () => {
    const modeUpdate = useModeUpdate();
    const palette = usePalette();

    return (
        <Modal
            button={{
                backgroundColor: palette.two,
                children: "Train",
                legend: "Register to unlock",
                level: GLOBAL.userLevel.user,
                onClick: () => {
                    modeUpdate({ agent: "train" });
                },
            }}
            modal={{
                width: "200px",
                backgroundColor: palette.background,
                color: palette.text,
            }}
        >
            Train Agent
        </Modal>
    );
};

export default TrainModal;
