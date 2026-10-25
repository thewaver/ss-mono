import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/ToggleContent/ToggleContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ToggleContentProps } from "./ToggleContentReact.types";

export const PageToggleContent = (props: PropsWithChildren<ToggleContentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.toggleContent,
                layerClass,
                props.flags.checkedState === true && styles.isChecked,
                props.flags.checkedState === "mixed" && styles.isMixed,
                props.flags.isHovered && styles.isHovered,
                props.flags.isDisabled && styles.isDisabled,
                props.flags.hasError && styles.hasError,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        >
            <div className={styles.toggleTrack}>
                <div className={styles.toggleHandle} />
            </div>

            {props.children}
        </div>
    );
};
