import { css } from "@emotion/react";
import React, { useState, useLayoutEffect, useRef, useCallback } from "react";
import { Offset, PositionType } from "../../types";

// Emotion styles
const makeEmotion = (
    positionType: PositionType,
    left: string | null,
    top: string | null,
    isDragging: boolean
) => css`
    position: ${positionType};
    left: ${left};
    top: ${top};
    transform: translate(-50%, -50%);
    cursor: ${isDragging ? "grabbing" : "grab"};
`;

// Helper functions
const defaultPosition = (): Offset => {
    return {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    };
};
const zeroOffset: Offset = { x: 0, y: 0 };

/**
 * Generates a higher-order component that enables dragging functionality to the provided component.
 * @param ToDrag - the component to be wrapped and dragged
 * @param initialPosition - initial position of the wrapped component
 * @param positionType - CSS "position" to be applied to the wrapped component
 */
type dragMeProps<P> = {
    ToDrag: React.ComponentType<P>;
    initialPosition?: Offset;
    positionType?: PositionType;
};
const dragMe = <P extends object>({
    ToDrag,
    initialPosition,
    positionType = "fixed" as PositionType,
}: dragMeProps<P>) => {
    return (props: P) => {
        const wrapperRef = useRef<HTMLDivElement>(null);
        const [isDragging, setIsDragging] = useState(false);

        const position = useRef<Offset>(initialPosition ?? defaultPosition());
        const currentOffset = useRef<Offset>(zeroOffset);

        const newPosition = useCallback(
            (pos: number, axis: "x" | "y"): number =>
                position.current[axis] + pos - currentOffset.current[axis],
            []
        );

        const handleMouseDown = useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                if (isDragging) return;
                setIsDragging(true);
                currentOffset.current = {
                    x: e.clientX,
                    y: e.clientY,
                };
            },
            []
        );

        const handleMouseUp = useCallback(
            (e: MouseEvent) => {
                if (!isDragging) return;
                setIsDragging(false);
                position.current = {
                    x: newPosition(e.clientX, "x"),
                    y: newPosition(e.clientY, "y"),
                };
            },
            [isDragging, newPosition]
        );

        const handleMouseMove = useCallback(
            (e: MouseEvent) => {
                if (!isDragging) return;
                if (wrapperRef.current) {
                    wrapperRef.current.style.left =
                        newPosition(e.clientX, "x") + "px";
                    wrapperRef.current.style.top =
                        newPosition(e.clientY, "y") + "px";
                }
            },
            [isDragging, newPosition]
        );

        useLayoutEffect(() => {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }, [handleMouseUp, handleMouseMove]);

        const left = position.current.x + "px";
        const top = position.current.y + "px";
        const emotion = makeEmotion(positionType, left, top, isDragging);

        return (
            <div ref={wrapperRef} css={emotion} onMouseDown={handleMouseDown}>
                <ToDrag {...props} />
            </div>
        );
    };
};

export default dragMe;
