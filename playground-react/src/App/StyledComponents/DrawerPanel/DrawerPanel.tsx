import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/DrawerPanel/DrawerPanel.css";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import type { DrawerPanelProps } from "./DrawerPanel.types";

export const PageDrawerPanel = (props: PropsWithChildren<DrawerPanelProps>) => {
    return (
        <div
            className={[
                styles.drawerPanel,
                styles.drawerSizeVariants[props.edge],
                props.visibilityTarget === 1 ? styles.drawerSlideOn : styles.drawerSlideOffVariants[props.edge],
            ].join(" ")}
            style={{ transition: `transform ${props.transitionDurationMs}ms` }}
        >
            <PageLayer level={1}>{props.children}</PageLayer>
        </div>
    );
};
