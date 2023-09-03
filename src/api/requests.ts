import axios, { Method, AxiosError } from "axios";
import { BACK_URL } from "../config";
import {
    UserName,
    ItemListRequestType,
    ItemType,
    NewMovesRequest,
    NewMovesResponse,
    AgentDict,
    GameDict,
    GameBackend,
} from "../types";

type APIConfig<T> = {
    method: Method;
    endpoint: string;
    data?: T;
};
type ApiCallResult<T> = {
    result?: T;
    error?: string;
};

type ItemListRequest = UserName & {
    scope: ItemListRequestType;
};
type ItemListResponse = {
    status?: string;
    list?: AgentDict | GameDict;
};
type JustNamesResponse = {
    status?: string;
    list?: string[];
};
type FullGameResponse = {
    status: string;
    game?: GameBackend;
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

export const killWatchJob = async (userName: string) => {
    await axios({
        method: "DELETE",
        url: BACK_URL + "/watch/cancel",
        data: { userName },
    });
};

export const fetchNewMovesTiles = async (
    request: NewMovesRequest
): Promise<NewMovesResponse> => {
    const { result, error } = await connectAPI<
        NewMovesRequest,
        NewMovesResponse
    >({
        method: "POST",
        endpoint: "/watch/new_moves",
        data: request,
    });
    if (error) {
        console.log(error);
        return { status: error };
    }
    return {
        moves: result?.moves ?? [],
        tiles: result?.tiles ?? [],
        loadingWeights: result?.loadingWeights,
    };
};
