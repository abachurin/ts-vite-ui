import React from "react";
import { css } from "@emotion/react";
import { AlignProps } from "../../types";
import Modal from "../modal/Modal";
import ModalHeader from "../modal/ModalHeader";
import ModalBody from "../modal/ModalBody";
import Button from "../base/Button/Button";
import Icon from "../base/Icon/Icon";
import { TelegramIcon, WhatsappIcon } from "../base/Icon/SvgIcons";
import { GLOBAL } from "../../utils";

// Emotion styles
const emotion = css`
    display: flex;
    flex-direction: column;
    gap: ${GLOBAL.padding};
    padding-bottom: calc(${GLOBAL.padding} * 2);
    color: ${GLOBAL.colors.white};
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

const xxx = (e: React.MouseEvent) => {
    console.log(e.target);
};

/**
 * Returns a React Modal component containing the Contacts section.
 */
const ContactsModal = ({ align }: AlignProps) => {
    return (
        <Modal
            button={{ align: align, children: "Contacts" }}
            modal={{ width: "20em" }}
        >
            <ModalHeader>Contact the Author via:</ModalHeader>
            <ModalBody>
                <div css={emotion}>
                    <div>
                        <Icon
                            svg={GLOBAL.svg.email}
                            initialSize={24}
                            rescaleFactor={2}
                            color={GLOBAL.colors.orange}
                        />
                        <Button
                            type='clickPress'
                            align='center'
                            width={GLOBAL.contactButtonWidth}
                            backgroundColor={GLOBAL.colors.orange}
                            onClick={() =>
                                window.open("mailto: bachurin.alex@gmail.com")
                            }
                        >
                            Send E-mail
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
                            backgroundColor={GLOBAL.colors.green}
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
                            backgroundColor={GLOBAL.colors.blue}
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
