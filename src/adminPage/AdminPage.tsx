import { css } from "@emotion/react";
import { useIsAdmin } from "../contexts/UserProvider/UserContext";
import { GLOBAL } from "../utils";
import useAlert from "../hooks/useAlert";
import Pane from "../components/main/Pane";
import LogWindow from "../components/main/PaneAgent/LogWindow";
import AdminManage from "./AdminManage";
import { useEffect } from "react";

// Emotion styles
const emotion = css`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    gap: ${GLOBAL.padding};
    flex-wrap: wrap;
    overflow: auto;
    font-size: 0.85em;
`;

const AdminPage = () => {
    const isAdmin = useIsAdmin();
    const [alert, openAlert, closeAlert] = useAlert({
        type: "error",
        duration: 10000000,
        children: "You are not authorized to access this page",
    });

    useEffect(() => {
        console.log(isAdmin);
        if (isAdmin) closeAlert();
        else openAlert();
    }, [isAdmin]);

    return (
        <>
            {isAdmin && (
                <div css={emotion}>
                    <Pane>
                        <LogWindow userName='admin' />
                    </Pane>
                    <AdminManage />
                </div>
            )}
            {alert}
        </>
    );
};

export default AdminPage;
