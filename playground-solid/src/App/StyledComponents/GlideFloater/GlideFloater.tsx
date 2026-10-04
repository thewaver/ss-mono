import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/GlideFloater/GlideFloater.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { GlideFloaterProps, GlideLabelProps } from "./GlideFloater.types";

export const PageGlideFloater = (props: GlideFloaterProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={access(props.kind) === "selection" ? styles.selectionGlideFloater : styles.highlightGlideFloater}
            classList={{ [getLayerClass()]: true, [styles.isVisible]: access(props.visibilityTarget) === 1 }}
            style={{ "transition-duration": `${access(props.transitionDurationMs)}ms` }}
            data-floater={access(props.kind)}
        />
    );
};

export const PageGlideLabel = (props: ParentProps<GlideLabelProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.glideLabel}
            classList={{ [getLayerClass()]: true, [styles.isSelected]: access(props.isSelected) }}
        >
            {props.children}
        </div>
    );
};
