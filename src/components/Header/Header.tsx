import { css } from "@emotion/react";
import { useState } from "react";
import useEventListener from "../../hooks/useEventListener";
import { RgbaColor } from "../../types";
import { GLOBAL } from "../../utils";
import Nav from "../base/Nav";
import ToggleNav from "../base/ToggleNav";
import Logo from "./Logo";
import SoundSwitch from "./SoundSwitch";
import AnimationSwitch from "./AnimationSwitch";
import ContactsModal from "./ContactsModal";
import HelpModal from "./HelpModal";
import AdminModal from "./AdminModal";
import SettingsModal from "./SettingsModal";
import Login from "./Login";

// Emotion styles
const makeEmotion = (backgroundColor: RgbaColor, textColor: string) => css`
    position: sticky;
    padding: ${GLOBAL.padding};
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: ${GLOBAL.padding};
    box-shadow: ${GLOBAL.boxShadow};
    background-color: ${backgroundColor};
    color: ${textColor};
    border-radius: ${GLOBAL.borderRadius};
    & > * {
        flex: 1;
    }
    & > :nth-of-type(2) {
        justify-content: center;
    }
`;

type HeaderProps = {
    backgroundColor: RgbaColor;
    textColor: string;
    logoColor: string;
};

const Header = ({ backgroundColor, textColor, logoColor }: HeaderProps) => {
    const [smallNav, setSmallNav] = useState<boolean>(true);

    useEventListener("resize", (): void => {
        const width = window.innerWidth;
        if (width < GLOBAL.navBreakpoint) {
            setSmallNav(true);
        } else if (width >= GLOBAL.navBreakpoint) {
            setSmallNav(false);
        }
    });

    const emotion = makeEmotion(backgroundColor, textColor);

    const NavX = (
        <>
            <div css={emotion}>
                <Logo color={logoColor} />
                <Nav>
                    <HelpModal />
                    <ContactsModal />
                    <AdminModal />
                    <SettingsModal />
                    <SoundSwitch />
                    <AnimationSwitch />
                </Nav>
                <Login color={logoColor} align='right' />
            </div>
        </>
    );

    if (!smallNav) {
        return NavX;
    }

    const NavY = (
        <>
            <div css={emotion}>
                <Logo color={logoColor} />
                <Nav>
                    <SoundSwitch />
                    <AnimationSwitch />
                </Nav>
                <ToggleNav
                    align='right'
                    backgroundColor={backgroundColor}
                    logoColor={logoColor}
                >
                    <HelpModal />
                    <ContactsModal />
                    <AdminModal />
                    <SettingsModal />
                    <Login color={logoColor} />
                </ToggleNav>
            </div>
        </>
    );

    return NavY;
};

export default Header;
