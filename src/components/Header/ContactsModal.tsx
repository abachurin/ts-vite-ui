import { css } from "@emotion/react";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import { AlignProps } from "../../types";
import Modal from "../modal/Modal";
import ModalHeader from "../modal/ModalHeader";
import ModalBody from "../modal/ModalBody";
import Button from "../base/Button/Button";
import Icon from "../base/Icon/Icon";
import { TelegramIcon, WhatsappIcon } from "../base/Icon/SvgIcons";
import { GLOBAL, SvgPaths } from "../../utils";

// Emotion styles
const emotion = css`
    display: flex;
    flex-direction: column;
    gap: ${GLOBAL.padding};
    padding-bottom: calc(${GLOBAL.padding} * 2);
    & > * {
        flex: 1;
        display: flex;
        align-items: center;
        gap: ${GLOBAL.padding};
    }
    & > * > :last-child {
        flex: 1;
        text-transform: uppercase;
        font-weight: 400;
    }
`;

/**
 * Returns a React Modal component containing the Contacts section.
 * @param align - The alignment parameter of the button, which opens the modal.
 */
const ContactsModal = ({ align }: AlignProps) => {
    const palette = usePalette();

    const headerStyle = css`
        color: ${palette.text};
    `;

    return (
        <Modal
            button={{ align: align, children: "Contacts" }}
            modal={{
                width: "24em",
                backgroundColor: palette.background,
                color: palette.text,
            }}
        >
            <ModalHeader>
                <h1 css={headerStyle}>Contact the Author via:</h1>
            </ModalHeader>
            <ModalBody>
                <div css={emotion}>
                    <div>
                        <Icon
                            svg={SvgPaths.email}
                            initialSize={24}
                            rescaleFactor={2}
                            color={palette.one}
                        />
                        <Button
                            type='clickPress'
                            align='center'
                            width={GLOBAL.contactButtonWidth}
                            backgroundColor={palette.one}
                            color={palette.background}
                            onClick={() =>
                                window.open("mailto: bachurin.alex@gmail.com")
                            }
                        >
                            E-mail
                        </Button>
                    </div>
                    <div>
                        <Icon
                            svg={WhatsappIcon}
                            initialSize={48}
                            rescaleFactor={1}
                        />
                        <Button
                            type='clickPress'
                            align='center'
                            width={GLOBAL.contactButtonWidth}
                            backgroundColor={palette.two}
                            color={palette.background}
                            onClick={() =>
                                window.open("https://wa.me/351961072567")
                            }
                        >
                            Whatsapp
                        </Button>
                    </div>
                    <div>
                        <Icon
                            svg={TelegramIcon}
                            initialSize={48}
                            rescaleFactor={1}
                        />
                        <Button
                            type='clickPress'
                            align='center'
                            width={GLOBAL.contactButtonWidth}
                            backgroundColor={palette.three}
                            color={palette.background}
                            onClick={() =>
                                window.open("https://t.me/abachurin1974")
                            }
                        >
                            Telegram
                        </Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default ContactsModal;
