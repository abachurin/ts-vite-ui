import { useUserName } from "../contexts/UserProvider/UserContext";
import useJobDescription from "./useJobDescription";

/**
 * Hook that returns true if Train/Test modes should be disabled
 * @return True if there is a running job, false otherwise.
 */
const useAnyRunningJob = () => {
    const userName = useUserName();
    const job = useJobDescription(userName);
    return job !== null || userName === "Login";
};

export default useAnyRunningJob;
