import { SvgPaths } from "../../../utils";
import Button from "./Button";
import Icon from "../Icon/Icon";

/**
 * Renders a Close button component with an onClick event handler.
 */
type CloseButtonProps = {
    toggleModal?: false | "none";
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
