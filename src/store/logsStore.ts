import { useEffect, useState } from "react";
import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import { connectAPI } from "../api/requests";
import { UserName } from "../types";
import { GLOBAL } from "../utils/utils";

type Logs = string[];
type LogsRequest = UserName & {
    lastLog: number;
};
type LogsResponse = {
    status: string;
    logs: Logs;
    lastLog: number;
};

const fetchLogs = async (
    userName: string,
    lastLog: number
): Promise<LogsResponse> => {
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
    addNewLogs: (newLogs: Logs) => Logs;
    currentUser: string;
    setCurrentUser: (newUserName: string) => void;
    clearLogs: (userName: string) => void;
    downloadLogs: () => void;
    lastLog: number;
    setLastLog: (newLastLog: number) => void;
    refreshLogs: (newUserName: string) => void;
}
const useLogsStore = create<LogsStore>((set, get) => ({
    logs: [],
    setLogs: (newLogs: Logs) =>
        set(() => ({
            logs: newLogs,
        })),
    addNewLogs: (newLogs: Logs) => {
        const currentLogs = get().logs;
        let updatedLogs: Logs = [...currentLogs, ...newLogs];
        if (updatedLogs.length > GLOBAL.maxLogs + 20) {
            updatedLogs = updatedLogs.slice(
                updatedLogs.length - GLOBAL.maxLogs
            );
        }
        return updatedLogs;
    },
    currentUser: "",
    setCurrentUser: (newUserName: string) => {
        set(() => ({
            currentUser: newUserName,
        }));
    },
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
    refreshLogs: (newUserName: string) => {
        set(() => ({
            logs: [],
            lastLog: -1,
            currentUser: newUserName,
        }));
    },
}));

export default useLogsStore;

export const useLogs = (
    userName: string
): { logs: Logs; alertBackend: boolean } => {
    const logs = useLogsStore((state) => state.logs);
    const setLogs = useLogsStore((state) => state.setLogs);
    const addNewLogs = useLogsStore((state) => state.addNewLogs);
    const lastLog = useLogsStore((state) => state.lastLog);
    const setLastLog = useLogsStore((state) => state.setLastLog);
    const currentUser = useLogsStore((state) => state.currentUser);
    const setCurrentUser = useLogsStore((state) => state.setCurrentUser);

    const [alertBackend, setAlertBackend] = useState(false);

    const isNewUser = userName != currentUser;
    const newLastLog = isNewUser ? -1 : lastLog;

    useEffect(() => {
        if (isNewUser) {
            setLogs([]);
            setLastLog(-1);
            setCurrentUser(userName);
        }
    }, [isNewUser, userName, setLogs, setLastLog, setCurrentUser]);

    const { data } = useQuery<LogsResponse>(
        ["Logs", userName],
        () => fetchLogs(userName, newLastLog),
        {
            refetchInterval: 5000,
        }
    );

    useEffect(() => {
        if (data) {
            if (data.status !== "ok") {
                setAlertBackend(true);
            } else if (data.logs) {
                setLogs(isNewUser ? data.logs : addNewLogs(data.logs));
                setLastLog(data.lastLog);
                setAlertBackend(false);
            }
        }
    }, [data, isNewUser, setLogs, setLastLog, addNewLogs, setAlertBackend]);

    return { logs, alertBackend };
};
