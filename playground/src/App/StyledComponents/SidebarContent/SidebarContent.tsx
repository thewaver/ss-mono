import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { SidebarFadeProps, SidebarFrameProps, SidebarSurfaceProps } from "./SidebarContent.types";

import * as styles from "./SidebarContent.css";

export const PageSidebarFrame = (props: ParentProps<SidebarFrameProps>) => (
    <div class={[styles.sidebarFrame, styles.sidebarFrameVariants[access(props.edge)]].join(" ")}>{props.children}</div>
);

export const PageSidebarSurface = (props: ParentProps<SidebarSurfaceProps>) => (
    <div class={styles.sidebarSurface}>
        <div class={styles.sidebarSurfaceContent} style={{ width: `${access(props.width)}px` }}>
            {props.children}
        </div>
    </div>
);

export const PageSidebarFade = (props: ParentProps<SidebarFadeProps>) => (
    <div
        class={styles.sidebarFade}
        classList={{
            [styles.isFaded]: access(props.phase) === "collapsing" || access(props.phase) === "collapsed",
            [styles.isHidden]: access(props.phase) === "collapsed",
        }}
        style={{ "transition-duration": `${access(props.transitionDurationMs)}ms` }}
    >
        {props.children}
    </div>
);

export const PageSidebarPhase = (props: ParentProps) => <div class={styles.sidebarPhase}>{props.children}</div>;

export const PageSidebarNeighbor = (props: ParentProps) => <div class={styles.sidebarNeighbor}>{props.children}</div>;
