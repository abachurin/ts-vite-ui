import axios, { Method, AxiosError } from "axios";
import { BACK_URL } from "../config";

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