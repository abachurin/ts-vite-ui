import useModeStore, { modeDescription } from "../../../store/modeStore";
import { useUserName } from "../../../contexts/UserProvider/UserContext";
import Pane from "../Pane";
import PaneHeader from "../PaneHeader";
import PaneBody from "../PaneBody";
import TrainModal from "./TrainModal";
import TestModal from "./TestModal";
import ManageModal from "./ManageModal";
import CurrentJobDescription from "./CurrentJobDescription";
import LogWindow from "./LogWindow";

/**
 * Renders the Agent Pane component on the left, goes top on small screen.
 */
const PaneAgent = () => {
    const agentMode = useModeStore((state) => state.agentMode);
    const agentName = useModeStore((state) => state.agentName);
    const userName = useUserName();

    return (
        <Pane id='agent-pane'>
            <PaneHeader
                type='agent'
                text={modeDescription(agentMode, agentName)}
            >
                <TrainModal />
                <TestModal />
                <ManageModal />
            </PaneHeader>
            <PaneBody>
                <CurrentJobDescription />
                <LogWindow userName={userName} />
            </PaneBody>
        </Pane>
    );
};

export default PaneAgent;
