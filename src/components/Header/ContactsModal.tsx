import { css } from "@emotion/react";
import { useCallback, useMemo } from "react";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import { AlignProps } from "../../types";
import Modal from "../modal/Modal";
import ModalHeader from "../modal/ModalHeader";
import ModalBody from "../modal/ModalBody";
import Button from "../base/Button/Button";
import Icon from "../base/Icon/Icon";
import { TelegramIcon, WhatsappIcon, WebIcon } from "../base/Icon/SvgIcons";
import { GLOBAL, SvgPaths } from "../../utils/utils";

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

    const goMail = useCallback(
        () => window.open("mailto: bachurin.alex@gmail.com"),
        []
    );
    const goWhatsapp = useCallback(
        () => window.open("https://wa.me/351961072567"),
        []
    );
    const goTelegram = useCallback(
        () => window.open("https://t.me/abachurin1974"),
        []
    );
    const goWeb = useCallback(() => window.open("https://abachurin.com"), []);

    const contactMethods = useMemo(
        () => [
            {
                svg: SvgPaths.email,
                label: "E-mail",
                onClick: goMail,
                background: palette.one,
                initialSize: 24,
                rescaleFactor: 1.8,
            },
            {
                svg: WhatsappIcon,
                label: "Whatsapp",
                onClick: goWhatsapp,
                background: palette.two,
                initialSize: 48,
                rescaleFactor: 1,
            },
            {
                svg: TelegramIcon,
                label: "Telegram",
                onClick: goTelegram,
                background: palette.three,
                initialSize: 48,
                rescaleFactor: 1,
            },
            {
                svg: WebIcon,
                label: "www",
                onClick: goWeb,
                background: palette.four,
                initialSize: 64,
                rescaleFactor: 0.65,
            },
        ],
        [
            goMail,
            goTelegram,
            goWeb,
            goWhatsapp,
            palette.four,
            palette.one,
            palette.three,
            palette.two,
        ]
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
                    {contactMethods.map((method, idx) => (
                        <section key={idx}>
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
