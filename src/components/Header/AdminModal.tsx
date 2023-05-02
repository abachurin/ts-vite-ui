import { useContext } from "react";
import { UserContext } from "../../contexts/UserProvider/UserContext";
import Modal from "../modal/Modal";
import { GLOBAL } from "../../utils";
import { AlignProps } from "../../types";

/**
 * Returns a React Modal component containing the Admin section.
 * @param align - The alignment parameter of the button, which opens the modal
 */
const AdminModal = ({ align }: AlignProps) => {
    const user = useContext(UserContext);
    const palette = user.palette;

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
