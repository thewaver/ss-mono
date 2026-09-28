import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/RadioContent/RadioContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { RadioContentProps } from "./RadioContent.types";

export const PageRadioContent = (props: PropsWithChildren<RadioContentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.radioContent,
                layerClass,
                props.flags.checkedState === true && styles.isChecked,
                props.flags.isHovered && styles.isHovered,
                props.flags.isDisabled && styles.isDisabled,
                props.flags.hasError && styles.hasError,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className={styles.radioMarker}>
                <div className={styles.radioDot} />
            </div>

            {props.children}
        </div>
    );
};
