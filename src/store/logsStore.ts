import { useEffect } from "react";
import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import { connectAPI } from "../api/utils";
import { UserName, Logs, LogsResponse } from "../types";
import { GLOBAL } from "../utils";

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
        console.log(error);
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
    },
}));

const useLogs = (userName: string): Logs => {
    const setLogs = useLogsStore((state) => state.setLogs);
    const addLogs = useLogsStore((state) => state.addLogs);

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
                setLogs([]);
            } else if (data.logs) {
                addLogs(data.logs);
            }
        }
    }, [data, setLogs, addLogs]);

    return useLogsStore((state) => state.logs);
};

export default useLogs;
