import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/SidebarContent/SidebarContent.css";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import type { SidebarFadeProps, SidebarFrameProps, SidebarSurfaceProps } from "./SidebarContent.types";

export const PageSidebarFrame = (props: PropsWithChildren<SidebarFrameProps>) => (
    <div className={[styles.sidebarFrame, styles.sidebarFrameVariants[props.edge]].join(" ")}>{props.children}</div>
);

export const PageSidebarSurface = (props: PropsWithChildren<SidebarSurfaceProps>) => (
    <div className={styles.sidebarSurface}>
        <div className={styles.sidebarSurfaceContent} style={{ width: `${props.width}px` }}>
            <PageLayer level={1}>{props.children}</PageLayer>
        </div>
    </div>
);

export const PageSidebarFade = (props: PropsWithChildren<SidebarFadeProps>) => (
    <div
        className={[
            styles.sidebarFade,
            (props.phase === "collapsing" || props.phase === "collapsed") && styles.isFaded,
            props.phase === "collapsed" && styles.isHidden,
        ]
            .filter(Boolean)
            .join(" ")}
        style={{ transitionDuration: `${props.transitionDurationMs}ms` }}
    >
        {props.children}
    </div>
);

export const PageSidebarPhase = (props: PropsWithChildren) => (
    <div className={styles.sidebarPhase}>{props.children}</div>
);

export const PageSidebarNeighbor = (props: PropsWithChildren) => (
    <div className={styles.sidebarNeighbor}>{props.children}</div>
);
