import { css } from "@emotion/react";
import { useState, useMemo } from "react";
import { connectAPI } from "../../../api/utils";
import {
    useUser,
    usePalette,
    useNoUser,
} from "../../../contexts/UserProvider/UserContext";
import useAlertMessage from "../../../hooks/useAlertMessage";
import {
    ItemListRequest,
    AgentDict,
    GameDict,
    AgentListResponse,
    GameListResponse,
    ItemDeleteRequest,
} from "../../../types";
import {
    GLOBAL,
    changeBrightness,
    MyObjectDescriptionLabels,
} from "../../../utils";
import Modal from "../../modal/Modal";
import ModalHeader from "../../modal/ModalHeader";
import ModalBody from "../../modal/ModalBody";
import ModalFooter from "../../modal/ModalFooter";
import Button from "../../base/Button/Button";
import Dropdown from "../../base/Dropdown";
import Radio from "../../base/Radio";
import ConfirmDialog from "../../base/ConfirmDialog";
import DescriptionTable from "../../base/DescriptionTable";

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
    padding-block: calc(${GLOBAL.padding} * 2);
    padding-inline: ${GLOBAL.padding};
    & > main {
        flex: 1;
        margin-top: ${GLOBAL.padding};
        font-size: 0.85rem;
    }
`;

/**
 * Returns a React Modal component containing the Admin section.
 * @param align - The alignment parameter of the button, which opens the modal
 */
const ManageModal = () => {
    const palette = usePalette();
    const noUser = useNoUser();
    const user = useUser();

    const [kind, setKind] = useState("");
    const [item, setItem] = useState("");
    const [options, setOptions] = useState<AgentDict | GameDict>({});
    const [message, createMessage] = useAlertMessage("");

    const [confirmDelete, setConfirmDelete] = useState(false);

    const getOptions = async (
        type: string
    ): Promise<AgentDict | GameDict | undefined> => {
        const endpoint = type === "Agents" ? "/agents/list" : "/games/list";
        const { result, error } = await connectAPI<
            ItemListRequest,
            AgentListResponse | GameListResponse
        >({
            method: "POST",
            endpoint: endpoint,
            data: { userName: user.name, scope: "user" },
        });
        if (result !== undefined) {
            if (result.status === "ok") {
                return result.list ?? {};
            } else {
                createMessage(result.status, "error");
            }
        } else {
            createMessage(error ?? "Unknown error", "error");
        }
        return undefined;
    };

    const handleKindChange = async (newKind: string) => {
        const newOptions = await getOptions(newKind);
        if (newOptions === undefined) return;
        setKind(newKind);
        setOptions(newOptions);
        setItem(Object.keys(newOptions)[0] ?? "");
    };

    const deleteItem = async () => {
        const { error } = await connectAPI<ItemDeleteRequest, void>({
            method: "DELETE",
            endpoint: "/item/delete",
            data: { name: item, kind: kind },
        });
        if (error) createMessage(error, "error");
        else createMessage(`${item} deleted from ${kind}`, "success");
    };

    const backgroundColor = useMemo(
        () =>
            changeBrightness(
                kind === "Agents" ? palette.two : palette.one,
                0.3
            ),
        [kind, palette]
    );
    const description =
        MyObjectDescriptionLabels[kind === "Agents" ? "Agents" : "Games"];

    return (
        <Modal
            button={{
                background: palette.two,
                align: "left",
                children: "Objects",
                legend: "Only for registered users",
                disabled: noUser,
            }}
            modal={{
                width: "24rem",
                backgroundColor: palette.background,
                color: palette.text,
            }}
        >
            <ModalHeader>
                <h2>My Objects</h2>
            </ModalHeader>
            <ModalBody overflow='visible'>
                <div css={emotion}>
                    <Radio
                        backgroundColor={palette.background}
                        controlColor={palette.three}
                        color1={palette.two}
                        color2={palette.one}
                        label='Agents / Games'
                        options={["Agents", "Games"]}
                        initialValue={kind}
                        onChange={handleKindChange}
                    />
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
                        </main>
                    )}
                </div>
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
                        disabled={item === "" || item === GLOBAL.filler}
                    >
                        Delete
                    </Button>
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
