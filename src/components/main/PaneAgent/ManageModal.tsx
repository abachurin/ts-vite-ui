import { css } from "@emotion/react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { connectAPI, getItems } from "../../../api/requests";
import {
    useUserName,
    usePalette,
} from "../../../contexts/UserProvider/UserContext";
import useDimensions from "../../../hooks/useDimensions";
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
import { GLOBAL, changeBrightness, alphaSymbol } from "../../../utils/utils";
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
    & > aside {
        font-size: 0.85rem;
    }
`;

// Helper functions
const descriptionLabels: Record<ItemType | "", Record<string, string>> = {
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
    const userName = useUserName();

    const [kind, setKind] = useState<ItemType>("Agents");
    const [scope, setScope] = useState<ItemListRequestType>("all");
    const [options, setOptions] = useState<AgentDict | GameDict>({});
    const [item, setItem] = useState("");
    const [keys, setKeys] = useState<string[]>([]);

    const { message, createMessage } = useAlertMessage();

    const chartComp =
        options[item] && (options[item] as Agent).history !== undefined ? (
            <Chart agent={options[item] as Agent} />
        ) : null;

    // Draggable Chart initial position is calculated when "Chart" button clicked
    const { width, height, ref, triggerResize } = useDimensions({ elem: true });
    const { appAlert, openAlert, closeAlert } = useAlert({
        type: "info",
        duration: 1000000,
        initialPosition: { x: width / 2, y: height / 2 },
        children: chartComp,
    });

    const owner = (options?.[item] ?? [])["user"];

    // Refresh data on User change
    useEffect(() => {
        setKind("Agents");
        setItem("");
        setOptions({});
    }, [userName]);

    // Refresh data on change of kind (Agents or Games) or scope (all or user)
    const handleChange = useCallback(
        async (newKindLabel?: string, checked?: boolean) => {
            const newKind =
                newKindLabel === undefined
                    ? kind
                    : newKindLabel === "Agents"
                    ? "Agents"
                    : "Games";
            const newScope =
                checked === undefined ? scope : checked ? "all" : "user";
            setKind(newKind);
            setScope(newScope);
            const { list, message } = await getItems(
                newKind,
                userName,
                newScope
            );
            if (message) {
                createMessage(message, "error");
                return;
            }
            const newKeys = Object.keys(list).sort((a, b) => {
                const A = list[a];
                const B = list[b];
                if ("bestScore" in A && "bestScore" in B)
                    return B.bestScore - A.bestScore;
                if ("score" in A && "score" in B) return B.score - A.score;
                return 0;
            });
            setOptions(list);
            setKeys(newKeys);
            setItem("");
        },
        [kind, userName, scope, createMessage]
    );
    const handleChangeKind = useCallback(
        (value: string) => handleChange(value, undefined),
        [handleChange]
    );
    const handleChangeScope = useCallback(
        (checked: boolean) => handleChange(undefined, checked),
        [handleChange]
    );
    const handleChangeAll = useCallback(() => handleChange(), [handleChange]);

    const deleteItem = useCallback(async () => {
        const { error } = await connectAPI<ItemDeleteRequest, void>({
            method: "DELETE",
            endpoint: "/item/delete",
            data: { name: item, kind: kind },
        });
        if (error) createMessage(error, "error");
        else {
            const { [item]: _, ...newOptions } = options;
            const newKeys = keys.filter((a) => a !== item);
            setOptions(newOptions);
            setKeys(newKeys);
            setItem(newKeys[0]);
            createMessage(`${item} deleted from ${kind}`, "success");
        }
    }, [options, keys, item, kind, createMessage]);

    const [confirmDelete, setConfirmDelete] = useState(false);
    const openConfirmDelete = useCallback(() => setConfirmDelete(true), []);
    const closeConfirmDelete = useCallback(() => setConfirmDelete(false), []);
    const closeAndDelete = useCallback(() => {
        setConfirmDelete(false);
        deleteItem();
    }, [deleteItem]);

    const backgroundColor = useMemo(
        () =>
            changeBrightness(
                kind === "Agents" ? palette.two : palette.one,
                0.3
            ),
        [kind, palette]
    );
    const brightOne = changeBrightness(palette.one, 1.5);

    const description = descriptionLabels[kind];

    return (
        <Modal
            button={{
                background: palette.two,
                align: "left",
                children: "Items Information",
                legend: "Only for registered users",
                onClick: handleChangeAll,
            }}
            modal={{
                width: "26rem",
                backgroundColor: palette.background,
                color: palette.text,
                onClose: closeAlert,
            }}
        >
            <ModalBody overflow='visible'>
                <div ref={ref} css={emotion}>
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
                                onChange={handleChangeKind}
                            />
                        </div>
                        <Checkbox
                            color1={palette.background}
                            color2={palette.background}
                            color3={brightOne}
                            controlColor={palette.three}
                            label={scope === "all" ? "All Users" : "My Items"}
                            checked={scope === "all"}
                            disabled={userName === "Login"}
                            onChange={handleChangeScope}
                        />
                    </section>
                    <Dropdown
                        alignOptions='right'
                        backgroundColor='white'
                        labelColor1={palette.two}
                        labelColor2={palette.one}
                        controlColor={palette.three}
                        optionValues={keys}
                        persistAs={`${userName}_manage-item`}
                        initialValue={item}
                        onChange={setItem}
                    />
                    {kind && keys.length > 0 && (
                        <main>
                            <DescriptionTable
                                background={backgroundColor}
                                textColor={palette.background}
                                borderColor='white'
                                collection={options?.[item] ?? []}
                                translation={description}
                            />
                        </main>
                    )}
                    {appAlert}
                    <aside>
                        * Items are sorted by Score in descending order
                    </aside>
                </div>
            </ModalBody>
            <ModalFooter>
                <footer css={footerWrapper}>
                    <Button
                        background={palette.error}
                        color={palette.background}
                        type='clickPress'
                        disabled={item === "" || owner !== userName}
                        onClick={openConfirmDelete}
                    >
                        Delete
                    </Button>
                    {kind === "Agents" ? (
                        <Button
                            background={palette.two}
                            color={palette.background}
                            type='clickPress'
                            disabled={item === ""}
                            onClick={() => {
                                triggerResize();
                                openAlert();
                            }}
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
                onConfirm={closeAndDelete}
                onCancel={closeConfirmDelete}
            />
        </Modal>
    );
};

export default ManageModal;
