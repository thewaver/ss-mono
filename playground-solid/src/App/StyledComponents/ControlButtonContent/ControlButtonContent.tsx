import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ControlButtonContentProps } from "./ControlButtonContent.types";

export const PageControlButtonContent = (props: ParentProps<ControlButtonContentProps>) => {
    const getLayerClass = useLayerClass();

    const getGlyph = () => access(props.glyph);

    return (
        <div
            class={styles.controlButton}
            classList={{
                [getLayerClass()]: true,
                [styles.controlButtonGlyph]: getGlyph() !== undefined,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isActive]: access(props.flags).isActive,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
            aria-hidden={getGlyph() !== undefined || undefined}
        >
            {getGlyph() ?? props.children}
        </div>
    );
};
