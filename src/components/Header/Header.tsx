import { css } from "@emotion/react";
import { useState, useMemo, useContext } from "react";
import { UserContext } from "../../contexts/UserProvider/UserContext";
import { palettes } from "../../contexts/UserProvider/palette";
import useEventListener from "../../hooks/useEventListener";
import { RGBA, RGB } from "../../types";
import { GLOBAL, setTransparency } from "../../utils";
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
const makeEmotion = (backgroundColor: RGB | RGBA, color: RGB) => css`
    position: sticky;
    padding: ${GLOBAL.padding};
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: ${GLOBAL.padding};
    box-shadow: ${GLOBAL.boxShadow};
    background-color: ${backgroundColor};
    color: ${color};
    border-radius: ${GLOBAL.borderRadius};
    & > * {
        flex: 1;
    }
    & > :nth-of-type(2) {
        justify-content: center;
    }
`;

// Helper functions

const isSmallScreen = (): boolean => window.innerWidth < GLOBAL.navBreakpoint;

const Header = () => {
    const user = useContext(UserContext);
    const palette = palettes[user.paletteName];
    const backgroundColor = setTransparency(
        palette.header,
        palette.headerOpacity
    );

    const [smallNav, setSmallNav] = useState<boolean>(isSmallScreen());

    useEventListener("resize", () => setSmallNav(isSmallScreen()));

    const emotion = useMemo(
        () => makeEmotion(backgroundColor, palette.background),
        [backgroundColor, palette]
    );

    const NavX = (
        <>
            <div css={emotion}>
                <Logo color={palette.logo} />
                <Nav>
                    <HelpModal />
                    <ContactsModal />
                    <AdminModal />
                    <SettingsModal />
                    <SoundSwitch />
                    <AnimationSwitch />
                </Nav>
                <Login color={palette.logo} align='right' />
            </div>
        </>
    );

    if (!smallNav) {
        return NavX;
    }

    const NavY = (
        <>
            <div css={emotion}>
                <Logo color={palette.logo} />
                <Nav>
                    <SoundSwitch />
                    <AnimationSwitch />
                </Nav>
                <ToggleNav
                    align='right'
                    backgroundColor={backgroundColor}
                    logoColor={palette.logo}
                >
                    <HelpModal />
                    <ContactsModal />
                    <AdminModal />
                    <SettingsModal />
                    <Login color={palette.logo} />
                </ToggleNav>
            </div>
        </>
    );

    return NavY;
};

export default Header;
