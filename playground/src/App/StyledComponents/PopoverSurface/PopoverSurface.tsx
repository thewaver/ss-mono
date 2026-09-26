import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { PopoverSurfaceProps } from "./PopoverSurface.types";

import * as styles from "./PopoverSurface.css";

export const PagePopoverSurface = (props: ParentProps<PopoverSurfaceProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.popoverSurface}
            classList={{
                [getLayerClass()]: true,
                [styles.isVisible]: access(props.visibilityTarget) === 1,
                [styles.isFlipped]: access(props.placement).y === "top-out",
            }}
            style={{
                transition: `opacity ${access(props.transitionDurationMs)}ms, transform ${access(props.transitionDurationMs)}ms`,
            }}
        >
            {props.children}
        </div>
    );
};
