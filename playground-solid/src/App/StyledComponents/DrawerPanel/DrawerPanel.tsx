import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/DrawerPanel/DrawerPanel.css";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import { useNextLayerClass } from "../Layer/Layer.context";
import type { DrawerPanelProps } from "./DrawerPanelSolid.types";

export const PageDrawerPanel = (props: ParentProps<DrawerPanelProps>) => {
    const getNextLayerClass = useNextLayerClass();

    return (
        <div
            class={[
                styles.drawerPanel,
                getNextLayerClass(),
                styles.drawerSizeVariants[access(props.edge)],
                access(props.visibilityTarget) === 1
                    ? styles.drawerSlideOn
                    : styles.drawerSlideOffVariants[access(props.edge)],
            ].join(" ")}
            style={{ transition: `transform ${access(props.transitionDurationMs)}ms` }}
        >
            <PageLayer>{props.children}</PageLayer>
        </div>
    );
};
