import { useRef, useCallback } from "react";
import Button, {ButtonProps} from "../base/Button";
import ModalWindow, {ModalWindowRef, ModalWindowProps} from "../modal/ModalWindow";
import { ChildrenProps } from "../../types";

interface ModalProps extends ChildrenProps {
    button?: ButtonProps;
    modal?: ModalWindowProps;
}

/**
 * Renders a modal component with a button that opens the modal when clicked.
 *
 * @param props - The props include Button props and children, as well as ModalWindow props.
 */
const Modal = ({button={children: "Click me"}, modal, children}: ModalProps) => {
    const ref = useRef<ModalWindowRef>(null);

    const openModal = useCallback((): void => {
        ref.current?.open();
      }, []);

    return (
        <div>
            <Button {...button} onClick={openModal}/>
            <ModalWindow {...modal} ref={ref}>{children}</ModalWindow>
        </div>
    );
}

export default Modal;
