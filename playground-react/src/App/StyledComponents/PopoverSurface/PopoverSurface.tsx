import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PopoverSurfaceProps } from "./PopoverSurface.types";

export const PagePopoverSurface = (props: PropsWithChildren<PopoverSurfaceProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.popoverSurface,
                layerClass,
                props.visibilityTarget === 1 && styles.isVisible,
                props.placement.y === "top-out" && styles.isFlipped,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{
                transition: `opacity ${props.transitionDurationMs}ms, transform ${props.transitionDurationMs}ms`,
            }}
        >
            {props.children}
        </div>
    );
};
