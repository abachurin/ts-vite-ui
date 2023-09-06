import { useEffect, useState } from "react";
import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import { connectAPI } from "../api/requests";
import { UserName } from "../types";
import { GLOBAL } from "../utils";

type Logs = string[];
type LogsRequest = UserName & {
    lastLog: number;
};
type LogsResponse = {
    status: string;
    logs: Logs;
    lastLog: number;
};

const addNewLogs = (currentLogs: Logs, newLogs: Logs): Logs => {
    let updatedLogs: Logs = [...currentLogs, ...newLogs];
    if (updatedLogs.length > GLOBAL.maxLogs + 20) {
        updatedLogs = updatedLogs.slice(updatedLogs.length - GLOBAL.maxLogs);
    }
    return updatedLogs;
};

const fetchLogs = async (
    userName: string,
    lastLog: number
): Promise<LogsResponse> => {
    if (userName === "Login") return { status: "ok", logs: [], lastLog: -1 };
    const { result, error } = await connectAPI<LogsRequest, LogsResponse>({
        method: "POST",
        endpoint: "/logs/update",
        data: { userName, lastLog },
    });
    if (error) {
        return { status: error, logs: [], lastLog: -1 };
    }
    if (result?.status !== "ok") {
        return { status: result?.status ?? "error", logs: [], lastLog: -1 };
    }
    return {
        status: "ok",
        logs: result?.logs ?? [],
        lastLog: result?.lastLog ?? -1,
    };
};

const clearLogs = async (userName: string): Promise<void> => {
    const { error } = await connectAPI<UserName, string>({
        method: "PUT",
        endpoint: "/logs/clear",
        data: { userName },
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
    lastLog: number;
    setLastLog: (newLastLog: number) => void;
}
const useLogsStore = create<LogsStore>((set, get) => ({
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
    lastLog: -1,
    setLastLog: (newLastLog: number) => {
        set(() => ({
            lastLog: newLastLog,
        }));
    },
}));

export default useLogsStore;

export const useLogs = (
    userName: string
): { logs: Logs; alertBackend: boolean } => {
    const { logs, addLogs, lastLog, setLastLog } = useLogsStore();

    const [alertBackend, setAlertBackend] = useState(false);

    const { data } = useQuery<LogsResponse>(
        ["Logs", userName],
        () => fetchLogs(userName, lastLog),
        {
            refetchInterval: 5000,
        }
    );

    useEffect(() => {
        if (data) {
            if (data.status !== "ok") {
                setAlertBackend(true);
            } else if (data.logs) {
                addLogs(data.logs);
                setLastLog(data.lastLog);
                setAlertBackend(false);
            }
        }
    }, [data]);

    return { logs, alertBackend };
};
