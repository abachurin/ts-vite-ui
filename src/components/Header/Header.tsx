import { css } from "@emotion/react";
import { useState, useMemo } from "react";
import useEventListener from "../../hooks/useEventListener";
import Logo from "./Logo";
import Nav from "../base/Nav";
import SoundSwitch from "./SoundSwitch";
import AnimationSwitch from "./AnimationSwitch";
import Login from "./Login";
import ToggleNav from "../base/ToggleNav";
import { GLOBAL } from "../../utils";
import HelpModal from "./HelpModal";
import ContactsModal from "./ContactsModal";
import AdminModal from "./AdminModal";
import SettingsModal from "./SettingsModal";
import { RgbaColor } from "../../types";

type HeaderProps = {
    backgroundColor: RgbaColor;
    textColor: string;
    logoColor: string;
}

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

    const emotion = useMemo(
        () => css`
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
        `,
        [backgroundColor, textColor]
    );

    const NavX = (
        <>
            <div css={emotion}>
                <Logo color={logoColor} />
                <Nav>
                    <HelpModal/>
                    <ContactsModal/>
                    <AdminModal/>
                    <SettingsModal/>
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
                <ToggleNav align='right' backgroundColor={backgroundColor}>
                    <HelpModal/>
                    <ContactsModal/>
                    <AdminModal/>
                    <SettingsModal/>
                    <Login color={logoColor}/>
                </ToggleNav>
            </div>
        </>
    );

    return NavY;
};

export default Header;
