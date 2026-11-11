import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/DrawerPanel/DrawerPanel.css";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import { useNextLayerClass } from "../Layer/Layer.context";
import type { DrawerPanelProps } from "./DrawerPanelReact.types";

export const PageDrawerPanel = (props: PropsWithChildren<DrawerPanelProps>) => {
    const nextLayerClass = useNextLayerClass();

    return (
        <div
            className={[
                styles.drawerPanel,
                nextLayerClass,
                styles.drawerSizeVariants[props.edge],
                props.visibilityTarget === 1 ? styles.drawerSlideOn : styles.drawerSlideOffVariants[props.edge],
            ].join(" ")}
            style={{ transition: `transform ${props.transitionDurationMs}ms` }}
        >
            <PageLayer>{props.children}</PageLayer>
        </div>
    );
};
