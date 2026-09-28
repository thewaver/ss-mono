import type { PropsWithChildren } from "react";

import { PlacementUtils } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/StepContent/StepContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { StepArcConnectorProps, StepConnectorProps, StepContentProps } from "./StepContent.types";

const MARKER_GLYPHS = {
    done: "✓",
    current: "",
    failed: "!",
    skipped: "–",
    ahead: "",
} as const;

export const PageStepContent = (props: PropsWithChildren<StepContentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                props.orientation === "horizontal" ? styles.rowStep : styles.columnStep,
                layerClass,
                props.flags.isCurrent && styles.isCurrent,
                props.flags.isHovered && styles.isHovered,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <span className={styles.marker[props.state]} aria-hidden="true">
                {MARKER_GLYPHS[props.state] || props.ordinal}
            </span>

            {props.children}
        </div>
    );
};

export const PageStepConnector = (props: StepConnectorProps) => {
    const layerClass = useLayerClass();

    const columnClass = props.isRail === true ? styles.columnRailConnector : styles.columnConnector;

    return (
        <span
            className={[props.orientation === "horizontal" ? styles.rowConnector : columnClass, layerClass].join(" ")}
        />
    );
};

export const PageStepArcCell = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.arcCell, layerClass].join(" ")}>{props.children}</div>;
};

export const PageStepArcConnector = (props: StepArcConnectorProps) => {
    const layerClass = useLayerClass();

    const defs = props.defs;

    const run =
        defs.from === undefined || defs.to === undefined
            ? undefined
            : PlacementUtils.getLinkPath(defs.from, defs.to, defs.origin, defs.radii);

    return run ? (
        <svg className={[styles.arcConnector, layerClass].join(" ")} viewBox={"0 0 1 1"} aria-hidden={"true"}>
            <path className={styles.arcConnectorPath} d={run} />
        </svg>
    ) : null;
};

export const PageStepBody = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.stepBody, layerClass].join(" ")}>{props.children}</div>;
};
