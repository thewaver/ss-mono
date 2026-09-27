import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/SplitPaneContent/SplitPaneContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SplitPaneCompareProps, SplitPaneGutterProps } from "./SplitPaneContent.types";

export const PageSplitPaneGutter = (props: SplitPaneGutterProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                props.orientation === "horizontal" ? styles.rowGutter : styles.columnGutter,
                layerClass,
                props.flags.isDragging && styles.isDragging,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
            data-gutter=""
        >
            <div className={props.orientation === "horizontal" ? styles.rowGrip : styles.columnGrip} />
        </div>
    );
};

export const PageSplitPaneBox = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.splitPaneBox, layerClass].join(" ")}>{props.children}</div>;
};

export const PageSplitPaneFrame = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.splitPaneFrame, layerClass].join(" ")}>{props.children}</div>;
};

export const PageSplitPaneCompareFrame = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.compareFrame, layerClass].join(" ")}>{props.children}</div>;
};

export const PageSplitPaneCompareBox = (props: SplitPaneCompareProps) => {
    const layerClass = useLayerClass();

    return (
        <div className={[styles.compareBox, layerClass].join(" ")}>
            <img
                className={props.side === "start" ? styles.compareStartImage : styles.compareEndImage}
                src={props.src}
                alt={props.alt}
            />
        </div>
    );
};
