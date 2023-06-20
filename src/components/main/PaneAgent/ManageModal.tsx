import {
    usePalette,
    useNoUser,
} from "../../../contexts/UserProvider/UserContext";
import Modal from "../../modal/Modal";

/**
 * Returns a React Modal component containing the Admin section.
 * @param align - The alignment parameter of the button, which opens the modal
 */
const ManageModal = () => {
    const palette = usePalette();
    const noUser = useNoUser();

    return (
        <Modal
            button={{
                background: palette.two,
                align: "left",
                children: "Manage",
                legend: "Only for registered users",
                disabled: noUser,
            }}
            modal={{
                width: "20rem",
                backgroundColor: palette.background,
                color: palette.text,
            }}
        >
            Manage my objects
        </Modal>
    );
};

export default ManageModal;
