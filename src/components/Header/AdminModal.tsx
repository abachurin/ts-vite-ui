import { useUser } from "../../contexts/UserProvider/UserContext";
import { palettes } from "../../contexts/UserProvider/palette";
import Modal from "../modal/Modal";
import { GLOBAL } from "../../utils";
import { AlignProps } from "../../types";

/**
 * Returns a React Modal component containing the Admin section.
 * @param align - The alignment parameter of the button, which opens the modal
 */
const AdminModal = ({ align }: AlignProps) => {
    const user = useUser();
    const palette = palettes[user.paletteName];

    return (
        <Modal
            button={{
                align: align,
                children: "Admin",
                legend: "Available only to Admin",
                level: GLOBAL.userLevel.admin,
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

export default AdminModal;
