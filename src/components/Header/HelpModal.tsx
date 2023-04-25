import Modal from "../modal/Modal"
import { AlignProps } from "../../types"

/**
 * Returns a React Modal component containing the Help section.
 */
const HelpModal = ({align}: AlignProps) => {
    return (
        <Modal
        button={{ align: align, children: "Help!" }}
        modal={{ width: "250px" }}
        >
        Help section
        </Modal>
    )
}

export default HelpModal