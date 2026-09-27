import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/SatelliteContent/SatelliteContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageSatelliteBadgeProps, PageSatelliteSubjectProps } from "./SatelliteContent.types";

export const PageSatelliteSubject = (props: ParentProps<PageSatelliteSubjectProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={[styles.satelliteSubject, getLayerClass()].join(" ")}
            style={{ width: `${access(props.width)}px`, height: `${access(props.height)}px` }}
        >
            {props.children}
        </div>
    );
};

export const PageSatelliteBadge = (props: ParentProps<PageSatelliteBadgeProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.satelliteBadge}
            classList={{ [getLayerClass()]: true, [styles.satelliteBadgeMuted]: access(props.isMuted) }}
            style={{ width: `${access(props.size)}px`, height: `${access(props.size)}px` }}
        >
            {props.children}
        </div>
    );
};

export const PageSatellitePill = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.satellitePill, getLayerClass()].join(" ")}>{props.children}</div>;
};
