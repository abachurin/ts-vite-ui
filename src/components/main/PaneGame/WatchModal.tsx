import { useModeUpdate } from "../../../contexts/ModeProvider/ModeContext";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import Modal from "../../modal/Modal";
import { AlignProps } from "../../../types";

/**
 * Returns a React Modal component containing the Admin section.
 * @param align - The alignment parameter of the button, which opens the modal
 */
const WatchModal = ({ align }: AlignProps) => {
    const modeUpdate = useModeUpdate();
    const palette = usePalette();

    return (
        <Modal
            button={{
                backgroundColor: palette.one,
                align: align,
                onClick: () => modeUpdate({ game: "watch" }),
                children: "Watch",
            }}
            modal={{
                backgroundColor: palette.background,
                color: palette.text,
            }}
        >
            Watch !!!
        </Modal>
    );
};

export default WatchModal;
