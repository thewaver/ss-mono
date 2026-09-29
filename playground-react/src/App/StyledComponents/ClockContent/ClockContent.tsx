import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/ClockContent/ClockContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ClockOptionProps } from "./ClockContent.types";

export const PageClockOption = (props: ClockOptionProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.clockOption,
                layerClass,
                props.renderProps.isSelected && styles.isSelected,
                props.renderProps.isNow && styles.isNow,
                props.renderProps.isHovered && styles.isHovered,
                props.renderProps.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        >
            {props.renderProps.option.label}
        </div>
    );
};

export const PageClockUnit = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.clockUnit, layerClass].join(" ")}>{props.children}</div>;
};

export const PageClockColumn = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.clockColumn, layerClass].join(" ")}>{props.children}</div>;
};

export const PageClockFrame = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.clockFrame, layerClass].join(" ")}>{props.children}</div>;
};
