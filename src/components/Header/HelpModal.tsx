import { css } from "@emotion/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import { AlignProps } from "../../types";
import { GLOBAL } from "../../utils";
import Modal from "../modal/Modal";
import ModalHeader from "../modal/ModalHeader";
import ModalBody from "../modal/ModalBody";
import ButtonGroup from "../base/Button/ButtonGroup";
import Button from "../base/Button/Button";
import guideUrl from "../../assets/description/guide.md";
import structureUrl from "../../assets/description/structure.md";
import historyOneUrl from "../../assets/description/history_1.md";
import historyTwoUrl from "../../assets/description/history_2.md";
import historyThreeUrl from "../../assets/description/history_3.md";
import historyFourUrl from "../../assets/description/history_4.md";
import chartTwo from "../../assets/description/score_chart_2_tile.png";
import chartThree from "../../assets/description/score_chart_3_tile.png";
import chartFive from "../../assets/description/score_chart_5_tile.png";

// Emotion styles

const emotion = css`
    flex: 1;
    margin-right: calc(${GLOBAL.padding} * 2);
    display: flex;
    justify-content: space-between;
`;

const markdown = css`
    padding: calc(${GLOBAL.padding} * 2);
    text-align: justify;
    text-justify: inter-word;
    & img {
        max-width: 100%;
        height: auto;
    }
    & ul {
        padding-left: ${GLOBAL.padding};
    }
    & h4 {
        font-size: 1.1rem;
    }
    & h5 {
        font-size: 1rem;
    }
`;

const historyMarkdown = css`
    display: flex;
    flex-direction: column;
`;
// Fetching markdown files
const fetchFile = async (url: string) => {
    const response = await fetch(url);
    const text = await response.text();
    return (
        <ReactMarkdown css={markdown} rehypePlugins={[rehypeRaw]}>
            {text}
        </ReactMarkdown>
    );
};

const guideContent = await fetchFile(guideUrl);
const structureContent = await fetchFile(structureUrl);
const historyOneContent = await fetchFile(historyOneUrl);
const historyTwoContent = await fetchFile(historyTwoUrl);
const historyThreeContent = await fetchFile(historyThreeUrl);
const historyFourContent = await fetchFile(historyFourUrl);

const historyContent = (
    <div css={historyMarkdown}>
        {historyOneContent}
        <img src={chartTwo} />
        {historyTwoContent}
        <img src={chartThree} />
        {historyThreeContent}
        <img src={chartFive} />
        {historyFourContent}
    </div>
);
/**
 * Returns a React Modal component containing the Help section.
 * @param align - The alignment parameter of the button, which opens the modal.
 */
const HelpModal = ({ align }: AlignProps) => {
    const palette = usePalette();
    const [section, setSection] = useState<"guide" | "history" | "structure">(
        "guide"
    );

    return (
        <Modal
            button={{ align: align, children: "Help!" }}
            modal={{
                width: `clamp(320px, 90%, 800px)`,
                height: "auto",
                backgroundColor: palette.background,
                color: palette.text,
            }}
        >
            <ModalHeader>
                <div css={emotion}>
                    <h1>{section.toUpperCase()}</h1>
                    <ButtonGroup>
                        <Button
                            type='clickPress'
                            background={palette.one}
                            color={palette.background}
                            onClick={() => setSection("guide")}
                        >
                            Guide
                        </Button>
                        <Button
                            type='clickPress'
                            background={palette.two}
                            color={palette.background}
                            onClick={() => setSection("history")}
                        >
                            History
                        </Button>
                        <Button
                            type='clickPress'
                            background={palette.three}
                            color={palette.background}
                            onClick={() => setSection("structure")}
                        >
                            Structure
                        </Button>
                    </ButtonGroup>
                </div>
            </ModalHeader>
            <ModalBody>
                {section === "guide"
                    ? guideContent
                    : section === "history"
                    ? historyContent
                    : structureContent}
            </ModalBody>
        </Modal>
    );
};

export default HelpModal;
