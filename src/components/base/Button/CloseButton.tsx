import { OnClick } from "../../../types";
import { SvgPaths } from "../../../utils";
import Button from "./Button";
import Icon from "../Icon/Icon";

/**
 * Renders a Close button component with an onClick event handler.
 */
type CloseButtonProps = {
    toggleModal?: "none" | false;
    onClick?: OnClick;
};
const CloseButton = ({ toggleModal = false, onClick }: CloseButtonProps) => {
    return (
        <Button
            type='clickPress'
            align='right'
            onClick={onClick}
            toggleModal={toggleModal}
        >
            <Icon svg={SvgPaths.closeWindow} rescaleFactor={1.2} />
        </Button>
    );
};

export default CloseButton;
