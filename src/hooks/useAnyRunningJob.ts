import { useUser } from "../contexts/UserProvider/UserContext";
import useJobDescription from "./useJobDescription";

/**
 * Hook that returns true if Train/Test modes should be disabled
 * @return True if there is a running job, false otherwise.
 */
const useAnyRunningJob = () => {
    const user = useUser();
    const job = useJobDescription(user.name);
    return job !== null || user.name === "Login";
};

export default useAnyRunningJob;
