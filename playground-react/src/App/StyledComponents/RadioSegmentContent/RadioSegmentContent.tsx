import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/RadioSegmentContent/RadioSegmentContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { RadioSegmentContentProps, RadioSegmentFloaterProps } from "./RadioSegmentContent.types";

export const PageRadioSegmentGroup = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.segmentGroup, layerClass].join(" ")}>{props.children}</div>;
};

export const PageRadioSegmentContent = (props: PropsWithChildren<RadioSegmentContentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.segmentContent,
                layerClass,
                props.flags.checkedState === true && styles.isChecked,
                props.flags.isHovered && styles.isHovered,
                props.flags.isDisabled && styles.isDisabled,
                props.flags.hasError && styles.hasError,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {props.children}
        </div>
    );
};

export const PageRadioSegmentFloater = (props: RadioSegmentFloaterProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[styles.segmentFloater, layerClass, props.visibilityTarget === 1 && styles.isVisible]
                .filter(Boolean)
                .join(" ")}
            style={{ transitionDuration: `${props.transitionDurationMs}ms` }}
            data-floater=""
        />
    );
};
