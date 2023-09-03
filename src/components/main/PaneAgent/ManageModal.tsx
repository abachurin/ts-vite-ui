import { css } from "@emotion/react";
import { useState, useMemo, useEffect } from "react";
import { connectAPI, getItems } from "../../../api/requests";
import {
    useUser,
    usePalette,
} from "../../../contexts/UserProvider/UserContext";
import useAlert from "../../../hooks/useAlert";
import useAlertMessage from "../../../hooks/useAlertMessage";
import {
    ItemType,
    ItemListRequestType,
    ItemDeleteRequest,
    AgentDict,
    GameDict,
    Agent,
} from "../../../types";
import { GLOBAL, changeBrightness, alphaSymbol } from "../../../utils";
import Modal from "../../modal/Modal";
import ModalBody from "../../modal/ModalBody";
import ModalFooter from "../../modal/ModalFooter";
import Button from "../../base/Button/Button";
import Dropdown from "../../base/Dropdown";
import Radio from "../../base/Radio";
import Checkbox from "../../base/Checkbox";
import ConfirmDialog from "../../base/ConfirmDialog";
import DescriptionTable from "../../base/DescriptionTable";
import CloseButton from "../../base/Button/CloseButton";
import Chart from "./Chart";

// Emotion styles
const footerWrapper = css`
    flex: 1;
    display: flex;
    justify-content: space-between;
`;
const emotion = css`
    display: flex;
    flex-direction: column;
    gap: ${GLOBAL.padding};
    padding-block: ${GLOBAL.padding};
    padding-inline: ${GLOBAL.padding};
    & > section {
        display: flex;
        gap: ${GLOBAL.padding};
    }
    & > section > div:first-of-type {
        flex: 1;
    }
    & > main {
        flex: 1;
        margin-top: ${GLOBAL.padding};
        font-size: 0.85rem;
        display: flex;
        flex-direction: column;
        gap: ${GLOBAL.padding};
    }
`;

// Helper functions
const MyObjectDescriptionLabels: Record<
    ItemType | "",
    Record<string, string>
> = {
    Agents: {
        user: "Owner:",
        name: "Agent name:",
        N: "Signature N:",
        alpha: `Current ${alphaSymbol}`,
        decay: `${alphaSymbol} decay rate`,
        step: "Decay step",
        minAlpha: `Minimal ${alphaSymbol}`,
        bestScore: "Best score:",
        maxTile: "Max tile reached:",
        lastTrainingEpisode: "Training episodes:",
    },
    Games: {
        user: "Owner:",
        name: "Game name:",
        score: "Score:",
        numMoves: "Number of moves:",
        maxTile: "Max tile reached:",
    },
    "": {},
};

/**
 * Item Management modal.
 */
const ManageModal = () => {
    const palette = usePalette();
    const user = useUser();

    const [kind, setKind] = useState<ItemType>("Agents");
    const [item, setItem] = useState("");
    const [scope, setScope] = useState<ItemListRequestType>("all");
    const [options, setOptions] = useState<AgentDict | GameDict>({});
    const [message, createMessage] = useAlertMessage("");

    const chartComp =
        options[item] && (options[item] as Agent).history !== undefined ? (
            <Chart agent={options[item] as Agent} />
        ) : null;

    const [chart, openChart, closeChart] = useAlert({
        type: "info",
        duration: 1000000,
        children: chartComp,
    });

    const owner = (options?.[item] ?? [])["user"];

    useEffect(() => {
        setKind("Agents");
        setItem("");
        setOptions({});
    }, [user]);

    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleChange = async (newKindLabel?: string, checked?: boolean) => {
        const newKind =
            newKindLabel === undefined
                ? kind
                : newKindLabel === "Agents"
                ? "Agents"
                : "Games";
        const newScope =
            checked === undefined ? scope : checked ? "all" : "user";
        const { list, message } = await getItems(newKind, user.name, newScope);
        if (message) {
            createMessage(message, "error");
            return;
        }
        newKindLabel && setKind(newKind);
        checked && setScope(newScope);
        setOptions(list);
        setItem(Object.keys(list)[0] ?? "");
    };

    const deleteItem = async () => {
        const { error } = await connectAPI<ItemDeleteRequest, void>({
            method: "DELETE",
            endpoint: "/item/delete",
            data: { name: item, kind: kind },
        });
        if (error) createMessage(error, "error");
        else {
            const { [item]: _, ...newOptions } = options;
            setOptions(newOptions);
            setItem("");
            createMessage(`${item} deleted from ${kind}`, "success");
        }
    };

    const backgroundColor = useMemo(
        () =>
            changeBrightness(
                kind === "Agents" ? palette.two : palette.one,
                0.3
            ),
        [kind, palette]
    );
    const brightOne = changeBrightness(palette.one, 1.5);

    const description = MyObjectDescriptionLabels[kind];

    return (
        <Modal
            button={{
                background: palette.two,
                align: "left",
                children: "Items Information",
                legend: "Only for registered users",
                onClick: () => handleChange(),
            }}
            modal={{
                width: "26rem",
                backgroundColor: palette.background,
                color: palette.text,
                onClose: closeChart,
            }}
        >
            <ModalBody overflow='visible'>
                <header css={emotion}>
                    <section>
                        <div>
                            <Radio
                                backgroundColor={palette.background}
                                controlColor={palette.three}
                                color1={palette.two}
                                color2={palette.one}
                                label='Agents / Games'
                                options={["Agents", "Games"]}
                                initialValue={kind}
                                onChange={(value) =>
                                    handleChange(value, undefined)
                                }
                            />
                        </div>
                        <Checkbox
                            color1={palette.background}
                            color2={palette.background}
                            color3={brightOne}
                            controlColor={palette.three}
                            label='All Users'
                            checked={scope === "all"}
                            onChange={(checked) =>
                                handleChange(undefined, checked)
                            }
                        />
                    </section>
                    <Dropdown
                        alignOptions='right'
                        backgroundColor='white'
                        labelColor1={palette.two}
                        labelColor2={palette.one}
                        controlColor={palette.three}
                        optionValues={Object.keys(options)}
                        initialValue={item}
                        persistAs='manage-value'
                        onChange={setItem}
                    />
                    {kind && Object.keys(options).length > 0 && (
                        <main>
                            <DescriptionTable
                                background={backgroundColor}
                                textColor={palette.background}
                                borderColor='white'
                                collection={options?.[item] ?? []}
                                translation={description}
                            />
                            {chart}
                        </main>
                    )}
                </header>
            </ModalBody>
            <ModalFooter>
                <footer css={footerWrapper}>
                    <Button
                        background={palette.error}
                        color={palette.background}
                        type='clickPress'
                        onClick={(e) => {
                            e.preventDefault();
                            setConfirmDelete(true);
                        }}
                        disabled={
                            item === "" ||
                            item === GLOBAL.filler ||
                            owner !== user.name
                        }
                    >
                        Delete
                    </Button>
                    {kind === "Agents" ? (
                        <Button
                            background={palette.two}
                            color={palette.background}
                            type='clickPress'
                            disabled={item === "" || item === GLOBAL.filler}
                            onClick={openChart}
                        >
                            Train History Chart
                        </Button>
                    ) : null}
                    <CloseButton />
                </footer>
            </ModalFooter>
            {message ? <ModalFooter>{message}</ModalFooter> : null}
            <ConfirmDialog
                isOpen={confirmDelete}
                message={`Are you sure you want to delete ${item} from ${kind}?`}
                onConfirm={() => {
                    setConfirmDelete(false);
                    deleteItem();
                }}
                onCancel={() => setConfirmDelete(false)}
            />
        </Modal>
    );
};

export default ManageModal;
