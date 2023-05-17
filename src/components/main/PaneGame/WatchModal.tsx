import { usePalette } from "../../../contexts/UserProvider/UserContext";
import Modal from "../../modal/Modal";
import { AlignProps } from "../../../types";

/**
 * Returns a React Modal component containing the Admin section.
 * @param align - The alignment parameter of the button, which opens the modal
 */
const WatchModal = ({ align }: AlignProps) => {
    const palette = usePalette();

    return (
        <Modal
            button={{
                backgroundColor: palette.one,
                align: align,
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
