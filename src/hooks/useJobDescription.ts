import { useQuery } from "@tanstack/react-query";
import { JobDescriptionResponse, UserName } from "../types";
import { connectAPI } from "../api/utils";

const fetchJobDescription = async (
    userName: string
): Promise<JobDescriptionResponse> => {
    const { result, error } = await connectAPI<
        UserName,
        JobDescriptionResponse
    >({
        method: "POST",
        endpoint: "/jobs/description",
        data: { userName: userName },
    });
    if (error) {
        console.log(error);
        return { status: error, job: null };
    }
    return { job: result?.job };
};

const useJobDescription = (userName: string) => {
    const { data } = useQuery<JobDescriptionResponse>(
        ["jobDescription", userName],
        () => fetchJobDescription(userName),
        {
            refetchInterval: 3000,
        }
    );

    return data?.job ?? null;
};

export default useJobDescription;
