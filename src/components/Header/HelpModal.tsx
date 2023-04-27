import Modal from "../modal/Modal";
import { AlignProps } from "../../types";
import ModalHeader from "../modal/ModalHeader";
import ModalBody from "../modal/ModalBody";
import ModalFooter from "../modal/ModalFooter";

/**
 * Returns a React Modal component containing the Help section.
 */
const HelpModal = ({ align }: AlignProps) => {
    return (
        <Modal
            button={{ align: align, children: "Help!" }}
            modal={{ width: `clamp(320px, 90%, 800px)`, height: "auto" }}
        >
            <ModalHeader>Help Section</ModalHeader>
            <ModalBody>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
                sequi repellendus similique deleniti quos maiores doloremque
                dolores, magnam nemo? Non, doloremque? Iste, voluptatem
                recusandae omnis libero nihil minima explicabo! Placeat quisquam
                architecto molestiae consectetur repellendus maxime maiores sint
                reprehenderit modi officiis corrupti laborum id placeat nihil.
                Accusantium quibusdam ex esse facere similique laborum
                cupiditate assumenda aperiam impedit laboriosam temporibus
                sequi, soluta neque non, molestiae culpa id quo, est et
                voluptatem eius? Incidunt iusto rem odio est eligendi nostrum
                adipisci asperiores reprehenderit cum, temporibus eaque a
                ducimus, dolore beatae! Corporis ut voluptas rerum accusantium
                obcaecati doloribus quam facere exercitationem, earum illum amet
                perspiciatis pariatur maiores deleniti accusamus eveniet quasi
                numquam architecto veritatis iusto tempore? Ullam dolorum sunt
                nisi facere impedit recusandae itaque totam soluta! Animi sequi
                sit maxime vero fugit facere assumenda dicta rem nobis totam
                iure quidem incidunt soluta pariatur, doloremque ut deserunt
                eligendi placeat molestias nisi.
            </ModalBody>
            <ModalFooter>Help Footer</ModalFooter>
        </Modal>
    );
};

export default HelpModal;
