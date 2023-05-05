import { SvgPaths } from "../../utils";
import Button from "./Button/Button";
import Icon from "./Icon/Icon";

/**
 * Renders a Close button component with an onClick event handler.
 */
const CloseButton = () => {
    return (
        <Button type='clickPress' align='right' toggleModal={false}>
            <Icon svg={SvgPaths.closeWindow} rescaleFactor={1.2} />
        </Button>
    );
};

export default CloseButton;
