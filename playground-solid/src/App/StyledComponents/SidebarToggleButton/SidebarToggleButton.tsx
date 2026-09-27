import { splitProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/SidebarToggleButton/SidebarToggleButton.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SidebarToggleButtonProps } from "./SidebarToggleButton.types";

const OPEN_TOWARDS_RIGHT = "›";
const OPEN_TOWARDS_LEFT = "‹";

export const PageSidebarToggleButton = (props: SidebarToggleButtonProps) => {
    const [local, others] = splitProps(props, ["flags", "edge", "isExpanded"]);

    const getLayerClass = useLayerClass();

    const getIsPointingRight = () => (access(local.edge) === "left") !== access(local.isExpanded);

    return (
        <button
            {...others}
            type="button"
            class={styles.sidebarToggle}
            classList={{ [getLayerClass()]: true, [styles.isHovered]: access(local.flags).isHovered }}
        >
            <span aria-hidden="true">{getIsPointingRight() ? OPEN_TOWARDS_RIGHT : OPEN_TOWARDS_LEFT}</span>
        </button>
    );
};
