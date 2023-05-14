import { ReactNode, useState, useEffect, useRef } from "react";
import { ChildrenProps, Position, PositionType } from "../types";
import { GLOBAL } from "../utils";
import StaticAlert, { AlertProps } from "../components/base/StaticAlert";
import dragMe from "../components/HOC/Draggable";

interface AlertHookProps extends ChildrenProps {
    draggable?: boolean;
    bad?: boolean;
    initialPosition?: Position;
    positionType?: PositionType;
    duration?: number;
}

const useAlert = ({
    draggable = true,
    bad,
    initialPosition,
    positionType,
    duration = GLOBAL.messageDuration,
    children,
}: AlertHookProps): [ReactNode, () => void] => {
    const [showAlert, setShowAlert] = useState(false);

    const AlertComponent: React.ComponentType<AlertProps> = draggable
        ? dragMe(StaticAlert, initialPosition, positionType)
        : StaticAlert;

    const openAlert = () => {
        setShowAlert(true);
    };

    const closeAlert = () => {
        setShowAlert(false);
    };

    const timer = useRef<NodeJS.Timeout>();
    useEffect(() => {
        if (showAlert) {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                closeAlert();
            }, duration);

            return () => clearTimeout(timer.current);
        }
    }, [showAlert, duration]);

    const props: AlertProps = {
        bad: bad,
        closeAlert: closeAlert,
        children: children,
    };

    const alert = showAlert ? <AlertComponent {...props} /> : null;

    return [alert, openAlert];
};

export default useAlert;
