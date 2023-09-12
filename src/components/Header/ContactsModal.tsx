import { css } from "@emotion/react";
import { useMemo } from "react";
import { uniqueId } from "lodash-es";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import { AlignProps } from "../../types";
import Modal from "../modal/Modal";
import ModalHeader from "../modal/ModalHeader";
import ModalBody from "../modal/ModalBody";
import Button from "../base/Button/Button";
import Icon from "../base/Icon/Icon";
import { TelegramIcon, WhatsappIcon, WebIcon } from "../base/Icon/SvgIcons";
import { GLOBAL, SvgPaths } from "../../utils";

// Emotion styles
const emotion = css`
    display: flex;
    flex-direction: column;
    gap: ${GLOBAL.padding};
    padding-block: calc(${GLOBAL.padding} * 2);
    & > section {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-right: ${GLOBAL.padding};
        gap: ${GLOBAL.padding};
        text-transform: uppercase;
    }
`;

/**
 * Contacts section.
 * @param align - alignment parameter of the o[pen modal button
 */
const ContactsModal = ({ align }: AlignProps) => {
    const palette = usePalette();

    const contactMethods = useMemo(
        () => [
            {
                svg: SvgPaths.email,
                label: "E-mail",
                onClick: () => window.open("mailto: bachurin.alex@gmail.com"),
                background: palette.one,
                initialSize: 24,
                rescaleFactor: 1.8,
            },
            {
                svg: WhatsappIcon,
                label: "Whatsapp",
                onClick: () => window.open("https://wa.me/351961072567"),
                background: palette.two,
                initialSize: 48,
                rescaleFactor: 1,
            },
            {
                svg: TelegramIcon,
                label: "Telegram",
                onClick: () => window.open("https://t.me/abachurin1974"),
                background: palette.three,
                initialSize: 48,
                rescaleFactor: 1,
            },
            {
                svg: WebIcon,
                label: "www",
                onClick: () => window.open("https://abachurin.com"),
                background: palette.four,
                initialSize: 64,
                rescaleFactor: 0.65,
            },
        ],
        [palette]
    );

    return (
        <Modal
            button={{ align, children: "Contacts" }}
            modal={{
                width: "28rem",
                backgroundColor: palette.background,
                color: palette.text,
            }}
        >
            <ModalHeader>
                <h1>Contact the Author via:</h1>
            </ModalHeader>
            <ModalBody>
                <div css={emotion}>
                    {contactMethods.map((method, _) => (
                        <section key={uniqueId()}>
                            <Icon {...method} />
                            <Button
                                type='clickPress'
                                align='center'
                                width={GLOBAL.contactButtonWidth}
                                background={method.background}
                                color={palette.background}
                                onClick={method.onClick}
                            >
                                {method.label}
                            </Button>
                        </section>
                    ))}
                </div>
            </ModalBody>
        </Modal>
    );
};

export default ContactsModal;
