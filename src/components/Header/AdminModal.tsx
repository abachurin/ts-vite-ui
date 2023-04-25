import Modal from "../modal/Modal"
import {GLOBAL} from "../../utils"
import { AlignProps } from "../../types"

/**
 * Returns a React Modal component containing the Admin section.
 */
const AdminModal = ({align}: AlignProps) => {
    return (
        <Modal
        button={{
            align: align,
            children: "Admin",
            legend: "Available only to Admin",
            level: GLOBAL.level.admin,
        }}
        >
        Admin section
        </Modal>
    )
}

export default AdminModal