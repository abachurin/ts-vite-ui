import { css } from "@emotion/react";
import { useState, useMemo, useEffect } from "react";
import { connectAPI, getItems } from "../../../api/utils";
import {
    useUser,
    usePalette,
} from "../../../contexts/UserProvider/UserContext";
import useAlertMessage from "../../../hooks/useAlertMessage";
import {
    ItemType,
    AgentDict,
    GameDict,
    ItemDeleteRequest,
} from "../../../types";
import {
    GLOBAL,
    changeBrightness,
    MyObjectDescriptionLabels,
} from "../../../utils";
import Modal from "../../modal/Modal";
import ModalBody from "../../modal/ModalBody";
import ModalFooter from "../../modal/ModalFooter";
import Button from "../../base/Button/Button";
import Dropdown from "../../base/Dropdown";
import Radio from "../../base/Radio";
import ConfirmDialog from "../../base/ConfirmDialog";
import DescriptionTable from "../../base/DescriptionTable";
import CloseButton from "../../base/Button/CloseButton";

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
    const user = useUser();

    const [kind, setKind] = useState<ItemType | "">("");
    const [item, setItem] = useState("");
    const [options, setOptions] = useState<AgentDict | GameDict>({});
    const [message, createMessage] = useAlertMessage("");

    const owner = (options?.[item] ?? [])["user"];

    useEffect(() => {
        setKind("");
        setItem("");
        setOptions({});
    }, [user]);

    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleKindChange = async (newKindLabel: string) => {
        const newKind = newKindLabel === "Agents" ? "Agents" : "Games";
        const { list, message } = await getItems(newKind, user.name, "all");
        if (message) {
            createMessage(message, "error");
            return;
        }
        setKind(newKind);
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
    const description = MyObjectDescriptionLabels[kind];

    return (
        <Modal
            button={{
                background: palette.two,
                align: "left",
                children: "Available Items",
                legend: "Only for registered users",
            }}
            modal={{
                width: "24rem",
                backgroundColor: palette.background,
                color: palette.text,
            }}
        >
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
                        disabled={
                            item === "" ||
                            item === GLOBAL.filler ||
                            owner !== user.name
                        }
                    >
                        Delete
                    </Button>
                </footer>
                <CloseButton />
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
