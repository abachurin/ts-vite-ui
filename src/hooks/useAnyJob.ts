import { useUser } from "../contexts/UserProvider/UserContext";
import useJobDescription from "./useJobDescription";

const useAnyRunningJob = () => {
    const user = useUser();
    const job = useJobDescription(user.name);
    return job !== null || user.name === "Login";
};

export default useAnyRunningJob;
