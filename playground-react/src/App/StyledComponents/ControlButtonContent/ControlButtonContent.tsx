import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ControlButtonContentProps } from "./ControlButtonContentReact.types";

export const PageControlButtonContent = (props: PropsWithChildren<ControlButtonContentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.controlButton,
                layerClass,
                props.glyph !== undefined && styles.controlButtonGlyph,
                props.flags.isHovered && styles.isHovered,
                props.flags.isActive && styles.isActive,
                props.flags.isPressed && styles.isPressed,
                props.flags.isDisabled && styles.isDisabled,
                props.flags.hasError && styles.hasError,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden={props.glyph !== undefined || undefined}
        >
            {props.glyph ?? props.children}
        </div>
    );
};
