import { useQuery } from "@tanstack/react-query";
import { UserName } from "../types";
import { connectAPI } from "../api/requests";

type Job = {
    description: string;
    type: number;
    name: string;
    episodes: number;
    start: string;
    timeElapsed: string;
    remainingTimeEstimate: string;
};
type TrainJobDescription = Job & {
    currentAlpha: number;
};
type TestJobDescription = Job & {
    depth: number;
    width: number;
    trigger: number;
};
type JobDescription = TrainJobDescription | TestJobDescription | null;
type JobDescriptionResponse = {
    status?: string;
    job?: JobDescription;
};

const fetchJobDescription = async (
    userName: string
): Promise<JobDescriptionResponse> => {
    if (userName === "Login") {
        return Promise.resolve({ job: null });
    }
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

/**
 * Hook that returns the current running job description for a given user.
 * @param userName - The name of the user
 * @return Job description for the user, or null if it is not available.
 */
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
