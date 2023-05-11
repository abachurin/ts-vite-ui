import Pane from "./Pane";
import PaneHeader from "./PaneHeader";
import TrainModal from "./TrainModal";
import TestModal from "./TestModal";

/**
 * Renders the Agent Pane component on the left, goes top on small screen.
 */
const PaneAgent = () => {
    return (
        <Pane id='agent-pane'>
            <PaneHeader type='agent'>
                <TrainModal />
                <TestModal />
            </PaneHeader>
        </Pane>
    );
};

export default PaneAgent;
