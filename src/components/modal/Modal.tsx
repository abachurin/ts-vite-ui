import ModalProvider from "../../contexts/ModalProvider/ModalProvider";
import { ChildrenProps } from "../../types";
import Button, { ButtonProps } from "../base/Button/Button";
import ModalWindow, { ModalWindowProps } from "../modal/ModalWindow";

/**
 * Renders a modal component with a Button that opens the modal.
 * @param props - The props include Button props, ModalWindow props and children to be rendered
 */
type ModalProps = ChildrenProps & {
    button?: ButtonProps;
    modal?: ModalWindowProps;
};
const Modal = ({
    button = { children: "Open Modal" },
    modal,
    children,
}: ModalProps) => {
    return (
        <ModalProvider>
            <Button {...button} toggleModal={true} />
            <ModalWindow {...modal}>{children}</ModalWindow>
        </ModalProvider>
    );
};

export default Modal;
