import { css } from "@emotion/react";
import { useMemo } from "react";
import { useUser } from "../../contexts/UserProvider/UserContext";
import { palettes } from "../../contexts/UserProvider/palette";
import useSmallScreen from "../../hooks/useSmallScreen";
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
const smallScreenStyle = css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

const Header = () => {
    const hiddenNavigation = useSmallScreen(GLOBAL.navBreakpoint);
    const user = useUser();
    const palette = palettes[user.paletteName];
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
            <div css={emotion}>
                <Logo color={palette.logo} />
                <Nav>
                    <SoundSwitch />
                    <AnimationSwitch />
                </Nav>
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
            </div>
        </>
    ) : (
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
                <Login align='right' />
            </div>
        </>
    );
};

export default Header;
