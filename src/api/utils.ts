import axios, { Method, AxiosError } from "axios";
import { BACK_URL } from "../config";
import {
    Agent,
    AgentListRequest,
    AgentListResponse,
    AgentListRequestType,
    AgentDict,
} from "../types";

export type APIConfig<T> = {
    method: Method;
    endpoint: string;
    data?: T;
};

export type ApiCallResult<T> = {
    result?: T;
    error?: string;
};

export const connectAPI = async <DataType, ResultType>({
    method,
    endpoint,
    data,
}: APIConfig<DataType>): Promise<ApiCallResult<ResultType>> => {
    try {
        const response = await axios({
            method,
            url: BACK_URL + endpoint,
            data,
        });
        return { result: response.data };
    } catch (error) {
        return { error: (error as AxiosError).message };
    }
};

export const getAgents = async (
    userName: string,
    scope: AgentListRequestType
): Promise<{ agents: AgentDict; message: string }> => {
    const { result, error } = await connectAPI<
        AgentListRequest,
        AgentListResponse
    >({
        method: "post",
        endpoint: "/agents/list",
        data: { userName: userName, scope: scope },
    });
    if (error) {
        return { agents: {}, message: error };
    } else {
        if (result === undefined || result.status !== "ok") {
            return {
                agents: {},
                message: result?.status ?? "Something is wrong!",
            };
        } else return { agents: result?.agents ?? {}, message: "" };
    }
};
