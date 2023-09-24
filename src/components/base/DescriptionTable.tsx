import { css } from "@emotion/react";
import { useMemo } from "react";
import { GLOBAL } from "../../utils/utils";

const makeEmotion = (
    background: string,
    textColor: string,
    borderColor: string
) => css`
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: calc(${GLOBAL.padding} * 2);
    border-radius: ${GLOBAL.borderRadius};
    background: ${background};
    color: ${textColor};
    line-height: 1.4rem;
    font-weight: 300;
    border: 1px solid ${borderColor};
    & > section {
        display: flex;
    }
    & > section > * {
        flex: 1;
    }
`;

type DescriptionTableProps = {
    background?: string;
    textColor?: string;
    borderColor?: string;
    collection: object;
    translation: Record<string, string>;
};
/**
 * Renders a table with descriptions.
 * @param background - background color
 * @param textColor - text color
 * @param borderColor - border color
 * @param collection - collection of data to display in the table
 * @param translation - translation map to translate labels
 */
const DescriptionTable = ({
    background = "inherit",
    textColor = "inherit",
    borderColor = "inherit",
    collection,
    translation,
}: DescriptionTableProps) => {
    const emotion = useMemo(
        () => makeEmotion(background, textColor, borderColor),
        [background, textColor, borderColor]
    );

    return (
        <div css={emotion}>
            {Object.entries(collection).map(([label, value]) => {
                const labelName =
                    translation[label as keyof typeof translation];
                return (
                    labelName && (
                        <section key={label}>
                            <label>{labelName}</label>
                            <div>{value as string}</div>
                        </section>
                    )
                );
            })}
        </div>
    );
};

export default DescriptionTable;
