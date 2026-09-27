import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/ColorInputContent/ColorInputContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ColorInputContentProps } from "./ColorInputContent.types";

export const PageColorInputContent = (props: ColorInputContentProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.colorInputContent,
                layerClass,
                props.renderProps.isHovered && styles.isHovered,
                props.renderProps.isDisabled && styles.isDisabled,
                props.renderProps.hasError && styles.hasError,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        >
            <div className={styles.colorInputSwatch} style={{ backgroundColor: props.renderProps.value }} />

            {!props.isCompact && <div className={styles.colorInputValue}>{props.renderProps.value}</div>}
        </div>
    );
};
