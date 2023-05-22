import { css } from "@emotion/react";
import { useMemo } from "react";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import useSmallScreen from "../../hooks/useSmallScreen";
import { RGBA, RGB } from "../../types";
import { GLOBAL, setTransparency } from "../../utils";
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
    border-radius: ${GLOBAL.borderRadius};
    background-color: ${backgroundColor};
    color: ${color};
    z-index: 3;
    & > * {
        flex: 1;
    }
    & * {
        text-transform: uppercase;
    }
`;
const smallScreenStyle = css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

const nav = css`
    display: flex;
    justify-content: center;
    gap: ${GLOBAL.padding};
`;

/**
 * Header component that renders the header section of the application.
 */
const Header = () => {
    const hiddenNavigation = useSmallScreen(GLOBAL.navBreakpoint);
    const palette = usePalette();
    const backgroundColor = setTransparency(
        palette.header,
        palette.headerOpacity
    );

    const emotion = useMemo(
        () => makeEmotion(backgroundColor, palette.background),
        [backgroundColor, palette]
    );

    return hiddenNavigation ? (
        <>
            <header css={emotion}>
                <Logo />
                <nav css={nav}>
                    <SoundSwitch />
                    <AnimationSwitch />
                </nav>
                <div css={smallScreenStyle}>
                    <ToggleNav
                        align='right'
                        backgroundColor={backgroundColor}
                        logoColor={palette.logo}
                    >
                        <HelpModal />
                        <ContactsModal />
                        <AdminModal />
                        <SettingsModal />
                    </ToggleNav>
                    <Login align='right' />
                </div>
            </header>
        </>
    ) : (
        <>
            <header css={emotion}>
                <Logo />
                <nav css={nav}>
                    <HelpModal />
                    <ContactsModal />
                    <AdminModal />
                    <SettingsModal />
                    <SoundSwitch />
                    <AnimationSwitch />
                </nav>
                <Login align='right' />
            </header>
        </>
    );
};

export default Header;
