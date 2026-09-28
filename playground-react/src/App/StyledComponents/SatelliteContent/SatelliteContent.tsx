import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/SatelliteContent/SatelliteContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageSatelliteBadgeProps, PageSatelliteSubjectProps } from "./SatelliteContent.types";

export const PageSatelliteSubject = (props: PropsWithChildren<PageSatelliteSubjectProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[styles.satelliteSubject, layerClass].join(" ")}
            style={{ width: `${props.width}px`, height: `${props.height}px` }}
        >
            {props.children}
        </div>
    );
};

export const PageSatelliteBadge = (props: PropsWithChildren<PageSatelliteBadgeProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[styles.satelliteBadge, layerClass, props.isMuted && styles.satelliteBadgeMuted]
                .filter(Boolean)
                .join(" ")}
            style={{ width: `${props.size}px`, height: `${props.size}px` }}
        >
            {props.children}
        </div>
    );
};

export const PageSatellitePill = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.satellitePill, layerClass].join(" ")}>{props.children}</div>;
};
