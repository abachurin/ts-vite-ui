import { useEffect, useState } from "react";
import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import { connectAPI } from "../api/requests";
import { UserName } from "../types";
import { GLOBAL } from "../utils";

type Logs = string[];
type LogsResponse = {
    status: string;
    logs: Logs;
};

const addNewLogs = (currentLogs: Logs, newLogs: Logs): Logs => {
    let updatedLogs: Logs = [...currentLogs, ...newLogs];
    if (updatedLogs.length > GLOBAL.maxLogs) {
        updatedLogs = updatedLogs.slice(updatedLogs.length - GLOBAL.maxLogs);
    }
    return updatedLogs;
};

const fetchLogs = async (userName: string): Promise<LogsResponse> => {
    const { result, error } = await connectAPI<UserName, LogsResponse>({
        method: "POST",
        endpoint: "/logs/update",
        data: { userName: userName },
    });
    if (error) {
        return { status: error, logs: [] };
    }
    if (result?.status !== "ok") {
        return { status: result?.status ?? "error", logs: [] };
    }
    return { status: "ok", logs: result?.logs ?? [] };
};

const clearLogs = async (userName: string): Promise<void> => {
    const { error } = await connectAPI<UserName, string>({
        method: "PUT",
        endpoint: "/logs/clear",
        data: { userName: userName },
    });
    if (error) {
        console.log(error);
    }
};

interface LogsStore {
    logs: Logs;
    setLogs: (newLogs: Logs) => void;
    addLogs: (newLogs: Logs) => void;
    clearLogs: (userName: string) => void;
    downloadLogs: () => void;
}

export const useLogsStore = create<LogsStore>((set, get) => ({
    logs: [],
    setLogs: (newLogs: Logs) =>
        set(() => ({
            logs: newLogs,
        })),
    addLogs: (newLogs: Logs) =>
        set((state) => ({
            logs: addNewLogs(state.logs, newLogs),
        })),
    clearLogs: (userName: string) => {
        clearLogs(userName);
        set(() => ({
            logs: [],
        }));
    },
    downloadLogs: () => {
        const logs = get().logs;
        if (logs.length) {
            const textToSave = logs.join("\n");
            const link = document.createElement("a");
            const file = new Blob([textToSave], {
                type: "text/plain;charset=utf-8",
            });
            link.href = URL.createObjectURL(file);
            link.download = "logs.txt";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },
}));

export default useLogsStore;

export const useLogs = (userName: string): [Logs, boolean] => {
    const setLogs = useLogsStore((state) => state.setLogs);
    const addLogs = useLogsStore((state) => state.addLogs);
    const [alert, setAlert] = useState(false);

    const { data } = useQuery<LogsResponse>(
        ["Logs", userName],
        () => fetchLogs(userName),
        {
            refetchInterval: 5000,
        }
    );

    useEffect(() => {
        if (data) {
            if (data.status !== "ok") {
                setAlert(true);
            } else if (data.logs) {
                addLogs(data.logs);
                setAlert(false);
            }
        }
    }, [data, setLogs, addLogs]);

    return [useLogsStore((state) => state.logs), alert];
};
