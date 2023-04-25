import Modal from "../modal/Modal"
import {GLOBAL} from "../../utils"
import { AlignProps } from "../../types"

/**
 * Returns a Modal component with a button that displays a settings section.
 */
const SettingsModal = ({align}: AlignProps) =>{
    return (
        <Modal
        button={{
            align: align,
            children: "Settings",
            legend: "Personal settings, available only to registered Users",
            level: GLOBAL.level.user,
        }}
        >
        Settings section
        </Modal>
    )
}

export default SettingsModal