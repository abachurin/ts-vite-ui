import { css } from "@emotion/react";
import { useEffect, useRef } from "react";
import { useUser } from "../../contexts/UserProvider/UserContext";
import { GLOBAL, randomNum } from "../../utils";
import useDimensions from "../../hooks/useDimensions";

// Emotion styles
const emotion = css`
    position: absolute;
    padding: 3em;
    height: 100%;
    width: 100%;
    background-color: black;
    overflow: hidden;
    z-index: -1;
`;

// Helper functions
type Star = {
    x: number;
    y: number;
    currentSize: number;
    finalSize: number;
    delta_x: number;
    delta_y: number;
    delta_size: number;
    color: string;
};

const StarFieldCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const user = useUser();
    const { width, height } = useDimensions();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = width;
            canvas.height = height;
            canvas.style.backgroundColor = "black";
            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

            const stars: Star[] = [];

            const maxSize = width > 600 ? 7 : 5;
            const inverseSpeed = 20 / user.animationSpeed;
            // const numberStars = Math.floor(
            //     (width * height) / GLOBAL.oneStarPixels
            // );
            const numIntervals = 100;
            const numberStars = 5;

            const addStar = () => {
                if (stars.length < numberStars) {
                    const x = randomNum(width);
                    const y = randomNum(height);
                    const delta_x =
                        (GLOBAL.depthOfStarField * (2 * x - width) - x) /
                        numIntervals;
                    const delta_y =
                        (GLOBAL.depthOfStarField * (2 * y - height) - y) /
                        numIntervals;
                    const currentSize = 1;
                    const finalSize = Math.round(randomNum(maxSize));
                    const delta_size = (finalSize - currentSize) / numIntervals;
                    const color = `hsl(${Math.random() * 360}, 100%, 85%)`;
                    stars.push({
                        x,
                        y,
                        currentSize,
                        finalSize,
                        delta_x,
                        delta_y,
                        delta_size,
                        color,
                    });
                }
            };

            for (let i = 0; i < numberStars; i++) {
                addStar();
            }
            console.log(stars.length);

            const drawStar = (star: Star): boolean => {
                // console.log("star");
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.currentSize, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillStyle = star.color;
                ctx.fill();
                star.currentSize += star.delta_size;
                if (star.currentSize >= star.finalSize) return true;
                // star.x += star.delta_x;
                // star.y += star.delta_y;
                return false;
            };

            const animate = () => {
                ctx.clearRect(0, 0, width, height);
                // if (stars.length) console.log(stars);
                for (let i = 0; i < stars.length; i++) {
                    // console.log(i);
                    const star = stars[i];
                    const deleteStar = drawStar(star);
                    if (deleteStar) {
                        // console.log("delete");
                        stars.splice(i, 1);
                    }
                    // addStar();
                }

                requestAnimationFrame(animate);
            };

            const animationDuration = 2000; // Total duration for star animation in milliseconds

            animate();
        }
    }, [width, height, user]);

    return <canvas ref={canvasRef} css={emotion} />;
};

export default StarFieldCanvas;
