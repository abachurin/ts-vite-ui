import { css } from "@emotion/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Modal from "../modal/Modal";
import { AlignProps } from "../../types";
import ModalHeader from "../modal/ModalHeader";
import ModalBody from "../modal/ModalBody";
import ButtonGroup from "../base/Button/ButtonGroup";
import Button from "../base/Button/Button";
import { GLOBAL } from "../../utils";

// Emotion styles

const markdown = css`
    padding: ${GLOBAL.padding};
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
 */
const HelpModal = ({ align }: AlignProps) => {
    const [section, setSection] = useState<"guide" | "history" | "structure">(
        "guide"
    );

    return (
        <Modal
            button={{ align: align, children: "Help!" }}
            modal={{ width: `clamp(320px, 90%, 800px)`, height: "auto" }}
        >
            <ModalHeader>
                <h3>{section.toUpperCase()}</h3>
                <ButtonGroup>
                    <Button
                        type='clickPress'
                        backgroundColor='rgb(50, 50, 224)'
                        color={GLOBAL.colors.white}
                        onClick={() => setSection("guide")}
                    >
                        Guide
                    </Button>
                    <Button
                        type='clickPress'
                        backgroundColor='rgb(204, 112, 0)'
                        color={GLOBAL.colors.white}
                        onClick={() => setSection("history")}
                    >
                        History
                    </Button>
                    <Button
                        type='clickPress'
                        backgroundColor='rgb(4, 96, 64)'
                        color={GLOBAL.colors.white}
                        onClick={() => setSection("structure")}
                    >
                        Structure
                    </Button>
                </ButtonGroup>
            </ModalHeader>
            <ModalBody>
                <ReactMarkdown css={markdown}>
                    {sections[section]}
                </ReactMarkdown>
            </ModalBody>
        </Modal>
    );
};

export default HelpModal;
