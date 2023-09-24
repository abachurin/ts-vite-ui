import React, {
    ReactNode,
    useState,
    useEffect,
    useRef,
    useCallback,
} from "react";
import { ChildrenProps, Offset, PositionType } from "../types";
import { paletteAlertType } from "../palette";
import { GLOBAL } from "../utils/utils";
import StaticAlert, { AlertProps } from "../components/base/StaticAlert";
import dragMe from "../components/HOC/Draggable";

/**
 * Hook for displaying a popover alert.
 * @param draggable - indicates if the alert is draggable
 * @param onlyOnce - indicates if the alert should be shown only once
 * @param type - type of the alert
 * @param initialPosition - initial position
 * @param positionType - CSS position property
 * @param duration - duration of the alert
 * @param children - content
 * @return An array containing the alert component, openAlert function, and closeAlert function
 */
type AlertHookProps = ChildrenProps & {
    draggable?: boolean;
    onlyOnce?: boolean;
    type?: paletteAlertType;
    initialPosition?: Offset;
    positionType?: PositionType;
    duration?: number;
};
const useAlert = ({
    draggable = true,
    onlyOnce = false,
    type,
    initialPosition,
    positionType,
    duration = GLOBAL.messageDuration,
    children,
}: AlertHookProps): {
    appAlert: ReactNode;
    openAlert: () => void;
    closeAlert: () => void;
} => {
    const notYetClicked = useRef(true);
    const [showAlert, setShowAlert] = useState(false);

    const AlertComponent: React.ComponentType<AlertProps> = draggable
        ? dragMe({ ToDrag: StaticAlert, initialPosition, positionType })
        : StaticAlert;

    const openAlert = useCallback(() => {
        if ((onlyOnce && notYetClicked.current) || !onlyOnce)
            setShowAlert(true);
        notYetClicked.current = false;
    }, [onlyOnce]);

    const closeAlert = useCallback(() => {
        setShowAlert(false);
    }, []);

    const timer = useRef<NodeJS.Timeout>();
    useEffect(() => {
        if (showAlert) {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                closeAlert();
            }, duration);

            return () => clearTimeout(timer.current);
        }
    }, [showAlert, closeAlert, duration]);

    const props: AlertProps = {
        type,
        closeAlert,
        children,
    };

    const alert = showAlert && children ? <AlertComponent {...props} /> : null;

    return { appAlert: alert, openAlert, closeAlert };
};

export default useAlert;
