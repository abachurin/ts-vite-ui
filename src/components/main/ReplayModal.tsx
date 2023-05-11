import { useModeUpdate } from "../../contexts/ModeProvider/ModeContext";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import Modal from "../modal/Modal";
import { GLOBAL } from "../../utils";
import { AlignProps } from "../../types";

/**
 * Returns a React Modal component containing the Admin section.
 * @param align - The alignment parameter of the button, which opens the modal
 */
const ReplayModal = ({ align }: AlignProps) => {
    const palette = usePalette();
    const modeUpdate = useModeUpdate();

    return (
        <Modal
            button={{
                backgroundColor: palette.one,
                align: align,
                children: "Replay",
                onClick: () => {
                    modeUpdate("replay");
                },
            }}
            modal={{
                backgroundColor: palette.background,
                color: palette.text,
            }}
        >
            Admin section
        </Modal>
    );
};

export default ReplayModal;
