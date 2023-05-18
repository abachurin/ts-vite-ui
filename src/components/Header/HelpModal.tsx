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
// Fetching markdown files
const fetchMarkdown = async (section: string) => {
    const response = await fetch(`src/assets/description/${section}.md`);
    return await response.text();
};

const sections = {
    guide: await fetchMarkdown("guide"),
    history: await fetchMarkdown("history"),
    structure: await fetchMarkdown("structure"),
};

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
                <ReactMarkdown css={markdown} rehypePlugins={[rehypeRaw]}>
                    {sections[section]}
                </ReactMarkdown>
            </ModalBody>
        </Modal>
    );
};

export default HelpModal;
