import Modal from "../modal/Modal"
import { AlignProps } from "../../types"

/**
 * Returns a React Modal component containing the Contacts section.
 */
const ContactsModal = ({align}: AlignProps) => {
    return (
        <Modal button={{ align: align, children: "Contacts" }}>
        Contacts section
        </Modal>
    )
}

export default ContactsModal