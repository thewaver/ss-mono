import * as styles from "@thewaver/ss-playground/App/StyledComponents/SidebarToggleButton/SidebarToggleButton.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SidebarToggleButtonProps } from "./SidebarToggleButton.types";

const OPEN_TOWARDS_RIGHT = "›";
const OPEN_TOWARDS_LEFT = "‹";

export const PageSidebarToggleButton = (props: SidebarToggleButtonProps) => {
    const { flags, edge, isExpanded, ...others } = props;

    const layerClass = useLayerClass();

    const isPointingRight = (edge === "left") !== isExpanded;

    return (
        <button
            {...others}
            type="button"
            className={[styles.sidebarToggle, layerClass, flags.isHovered && styles.isHovered]
                .filter(Boolean)
                .join(" ")}
        >
            <span aria-hidden="true">{isPointingRight ? OPEN_TOWARDS_RIGHT : OPEN_TOWARDS_LEFT}</span>
        </button>
    );
};
