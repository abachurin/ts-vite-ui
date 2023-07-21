import axios, { Method, AxiosError } from "axios";
import { BACK_URL } from "../config";
import {
    ItemListRequest,
    ItemListRequestType,
    ItemType,
    ItemListResponse,
    JustNamesResponse,
    AgentDict,
    GameDict,
    FullGameResponse,
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

export const getItems = async (
    kind: ItemType,
    userName: string,
    scope: ItemListRequestType
): Promise<{ list: AgentDict | GameDict; message: string }> => {
    const { result, error } = await connectAPI<
        ItemListRequest,
        ItemListResponse
    >({
        method: "post",
        endpoint: `/${kind.toLowerCase()}/list`,
        data: { userName: userName, scope: scope },
    });
    if (error) {
        return { list: {}, message: error };
    } else {
        if (result === undefined || result.status !== "ok") {
            return {
                list: {},
                message: result?.status ?? "Something is wrong!",
            };
        } else return { list: result?.list ?? {}, message: "" };
    }
};

export const getJustNames = async (
    kind: ItemType,
    userName: string,
    scope: ItemListRequestType
): Promise<{ list: string[]; message: string }> => {
    const { result, error } = await connectAPI<
        ItemListRequest,
        JustNamesResponse
    >({
        method: "post",
        endpoint: `/${kind.toLowerCase()}/just_names`,
        data: { userName: userName, scope: scope },
    });
    if (error) {
        return { list: [], message: error };
    } else {
        if (result === undefined || result.status !== "ok") {
            return {
                list: [],
                message: result?.status ?? "Something is wrong!",
            };
        } else return { list: result?.list ?? [], message: "" };
    }
};

export const getFullGame = async (
    gameName: string
): Promise<FullGameResponse> => {
    const { result, error } = await connectAPI<undefined, FullGameResponse>({
        method: "get",
        endpoint: `/games/${gameName}`,
    });
    if (error) {
        return { status: error };
    } else {
        if (result === undefined || result.status !== "ok") {
            return {
                status: result?.status ?? "Something is wrong!",
            };
        } else return { game: result?.game, status: "" };
    }
};
