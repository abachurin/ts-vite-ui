import { css } from "@emotion/react";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserProvider/UserContext";

// Emotion styles

interface CheckboxProps {
    width?: string;
    controlSize?: number;
    controlColor?: string;
    color1?: string;
    color2?: string;
    color3?: string;
    textColor?: string;
    checked?: boolean;
    label: string;
    onChange: (checked: boolean) => void;
}
const Slider = () => {
    return <div>Slider</div>;
};

export default Slider;

// .range-slider {
// 	position: relative;
// 	width: 80vmin;
// 	height: 20vmin;
// }

// .range-slider_input {
// 	width: 100%;
// 	position: absolute;
// 	top: 50%;
// 	z-index: 3;
// 	transform: translateY(-50%);
// 	-webkit-appearance: none;
//   appearance: none;
//   width: 100%;
//   height: 4px;
//   opacity: 0;
// 	margin: 0;
// }

// .range-slider_input::-webkit-slider-thumb {
//   -webkit-appearance: none;
//   appearance: none;
//   width: 100px;
//   height: 100px;
//   cursor: pointer;
// 	border-radius: 50%;
// 	opacity: 0;
// }

// .range-slider_input::-moz-range-thumb {
//   width: 14vmin;
//   height: 14vmin;
//   cursor: pointer;
// 	border-radius: 50%;
// 	opacity: 0;
// }

// .range-slider_thumb {
// 	width: 14vmin;
// 	height: 14vmin;
// 	border: 0.6vmin solid #303030;
// 	border-radius: 50%;
// 	position: absolute;
// 	left: 0;
// 	top: 50%;
// 	transform: translateY(-50%);
// 	background-color: #f4f4f4;
// 	display: flex;
// 	justify-content: center;
// 	align-items: center;
// 	font-weight: 700;
// 	font-size: 4vmin;
// 	color: #303030;
// 	z-index: 2;
// }

// .range-slider_line {
// 	height: 0.5vmin;
// 	width: 100%;
// 	background-color: #e1e1e1;
// 	top: 50%;
// 	transform: translateY(-50%);
// 	left: 0;
// 	position: absolute;
// 	z-index: 1;
// }

// .range-slider_line-fill {
// 	position: absolute;
// 	height: 0.5vmin;
// 	width: 0;
// 	background-color: #303030;
// }

// const slider_input = document.getElementById('slider_input'),
//       slider_thumb = document.getElementById('slider_thumb'),
//       slider_line = document.getElementById('slider_line');

// function showSliderValue() {
//   slider_thumb.innerHTML = slider_input.value;
//   const bulletPosition = (slider_input.value /slider_input.max),
//         space = slider_input.offsetWidth - slider_thumb.offsetWidth;

//   slider_thumb.style.left = (bulletPosition * space) + 'px';
//   slider_line.style.width = slider_input.value + '%';
// }

// showSliderValue();
// window.addEventListener("resize",showSliderValue);
// slider_input.addEventListener('input', showSliderValue, false);
