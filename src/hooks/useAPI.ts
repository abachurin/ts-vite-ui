import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { BACK_URL } from "../config";

type ApiResponse<T> = {
    data?: T | string;
    error: unknown;
};

const useAPI = <T>(
    method: AxiosRequestConfig["method"] = "get",
    endpoint: string,
    data?: unknown
) => {
    const [response, setResponse] = useState<ApiResponse<T> | undefined>({
        error: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const result = await axios({
                    method,
                    url: `${BACK_URL}/${endpoint}`,
                    data,
                });
                setResponse({ data: result.data, error: false });
            } catch (error) {
                console.error(error);
                setResponse({ error: error });
            } finally {
                setIsLoading(false);
            }
        };
        data && fetchData();
    }, [endpoint, method, data]);

    return { response, isLoading };
};

export default useAPI;
