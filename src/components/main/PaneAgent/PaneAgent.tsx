import Pane from "../Pane";
import PaneHeader from "../PaneHeader";
import TrainModal from "./TrainModal";
import TestModal from "./TestModal";
import ManageModal from "./ManageModal";

/**
 * Renders the Agent Pane component on the left, goes top on small screen.
 */
const PaneAgent = () => {
    return (
        <Pane id='agent-pane'>
            <PaneHeader type='agent'>
                <TrainModal />
                <TestModal />
                <ManageModal />
            </PaneHeader>
        </Pane>
    );
};

export default PaneAgent;
