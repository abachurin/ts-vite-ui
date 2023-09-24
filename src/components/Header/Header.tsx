import { css } from "@emotion/react";
import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import useDimensions from "../../hooks/useDimensions";
import { GLOBAL, setTransparency } from "../../utils/utils";
import ToggleNav from "../base/ToggleNav";
import Logo from "./Logo";
import SoundSwitch from "./SoundSwitch";
import AnimationSwitch from "./AnimationSwitch";
import ContactsModal from "./ContactsModal";
import HelpModal from "./HelpModal";
import SettingsModal from "./SettingsModal";
import Login from "./Login";
import Button from "../base/Button/Button";

// Emotion styles
const makeEmotion = (backgroundColor: string, color: string) => css`
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
 * App Header component.
 */
const Header = () => {
    const palette = usePalette();

    const navigate = useNavigate();
    const location = useLocation();

    const { width } = useDimensions({});
    const hiddenNavigation = width < GLOBAL.navBreakpoint;

    const AdminLink = (
        <Button
            legend='Available only to Admin'
            level={location.pathname === "/admin" ? 0 : GLOBAL.userLevel.admin}
            onClick={() =>
                navigate(location.pathname === "/admin" ? "/" : "/admin")
            }
        >
            {location.pathname === "/admin" ? "Main" : "Admin"}
        </Button>
    );

    const backgroundColor = setTransparency(
        palette.header,
        palette.headerOpacity
    );
    const emotion = useMemo(
        () => makeEmotion(backgroundColor, palette.background),
        [backgroundColor, palette.background]
    );

    return hiddenNavigation ? (
        <header css={emotion}>
            <Logo />
            <nav css={nav}>
                <SoundSwitch />
                <AnimationSwitch />
            </nav>
            <main css={smallScreenStyle}>
                <ToggleNav
                    align='right'
                    backgroundColor={backgroundColor}
                    logoColor={palette.logo}
                >
                    <HelpModal />
                    <ContactsModal />
                    {AdminLink}
                    <SettingsModal />
                </ToggleNav>
                <Login />
            </main>
        </header>
    ) : (
        <header css={emotion}>
            <Logo />
            <nav css={nav}>
                <HelpModal />
                <ContactsModal />
                {AdminLink}
                <SettingsModal />
                <SoundSwitch />
                <AnimationSwitch />
            </nav>
            <Login />
        </header>
    );
};

export default Header;
