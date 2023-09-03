import { usePalette } from "../../contexts/UserProvider/UserContext";
import Modal from "../modal/Modal";
import { GLOBAL } from "../../utils";
import { AlignProps } from "../../types";

/**
 * React Modal component containing the Admin section
 * @param align - alignment of the open modal button
 */
const AdminModal = ({ align }: AlignProps) => {
    const palette = usePalette();

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
            Admin section, to be developed
        </Modal>
    );
};

export default AdminModal;
