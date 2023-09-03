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

export const restrictedAgents = ["A6"];

/**
 * Connects to the API and makes a request.
 * @return value of ResultType if no error, error message otherwise
 */
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

/**
 * Retrieves a list of items based on the specified parameters.
 * @param kind - "Agents" or "Games"
 * @param userName - name of the User
 * @param scope - items only belonging to User, or all
 * @return A promise that resolves to an object containing the retrieved item list and a message.
 */
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

/**
 * Same as getItems, but only returns a list of names. Excludes Agents in restrictedAgents
 * ... unless the user is "Loki".
 */
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
        } else {
            const preliminaryList = result?.list ?? [];
            const finalList =
                userName === "Loki"
                    ? preliminaryList
                    : preliminaryList.filter(
                          (name) => !restrictedAgents.includes(name)
                      );
            return { list: finalList, message: "" };
        }
    }
};

/**
 * Retrieves the full game information for a given game name.
 */
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

/**
 * Cancels Watch Agent job if it exists
 */
export const killWatchJob = async (userName: string) => {
    await axios({
        method: "DELETE",
        url: BACK_URL + "/watch/cancel",
        data: { userName },
    });
};

/**
 * Fetches new moves for the Watch Agent functionality in GameBoard component
 */
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
