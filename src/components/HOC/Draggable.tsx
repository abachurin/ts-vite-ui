import { css, SerializedStyles } from "@emotion/react";
import React, { useState, useEffect, useRef } from "react";
import { Position, Offset, PositionType } from "../../types";

// Emotion styles
const makeEmotion = (
    positionType: PositionType,
    left: string,
    top: string,
    isDragging: boolean
): SerializedStyles => css`
    position: ${positionType};
    left: ${left};
    top: ${top};
    transform: translate(-50%, -50%);
    cursor: ${isDragging ? "grabbing" : "grab"};
`;

// Helper functions
const defaultPosition: Position = { x: "50%", y: "50%" };
const zeroOffset: Offset = { x: 0, y: 0 };

const dragMe = <P extends object>(
    ToDrag: React.ComponentType<P>,
    initialPosition = defaultPosition,
    positionType = "fixed" as PositionType
) => {
    return (props: P) => {
        const [isDragging, setIsDragging] = useState(false);
        const [offset, setOffset] = useState<Offset>(zeroOffset);
        const currentOffset = useRef<Offset>(zeroOffset);

        const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
            setIsDragging(true);
            const { clientX, clientY } = e;
            currentOffset.current = {
                x: clientX,
                y: clientY,
            };
        };
        const handleMouseUp = () => {
            setIsDragging(false);
        };

        useEffect(() => {
            const handleMouseMove = (e: MouseEvent) => {
                if (!isDragging) return;
                const { clientX, clientY } = e;
                setOffset({
                    x: clientX - currentOffset.current.x + offset.x,
                    y: clientY - currentOffset.current.y + offset.y,
                });
            };

            if (isDragging) {
                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
            }

            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }, [isDragging]);

        const left = `calc(${initialPosition.x} + ${offset.x}px)`;
        const top = `calc(${initialPosition.y} + ${offset.y}px)`;
        const emotion = makeEmotion(positionType, left, top, isDragging);

        return (
            <div css={emotion} onMouseDown={handleMouseDown}>
                <ToDrag {...props} />
            </div>
        );
    };
};

export default dragMe;
