import * as styles from "@thewaver/ss-playground/App/StyledComponents/TrailContent/TrailContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageTrailMarkerProps, PageTrailTrackProps, PageTrailVehicleProps } from "./TrailContent.types";

export const PageTrailTrack = (props: PageTrailTrackProps) => {
    const layerClass = useLayerClass();

    return <path className={[styles.trailTrack, layerClass].join(" ")} d={props.path} />;
};

export const PageTrailVehicle = (props: PageTrailVehicleProps) => {
    const layerClass = useLayerClass();

    return (
        <div id={props.id} className={[styles.trailVehicle, layerClass].join(" ")} aria-hidden="true">
            {props.label}
        </div>
    );
};

export const PageTrailMarker = (props: PageTrailMarkerProps) => {
    const layerClass = useLayerClass();

    return <div id={props.id} className={[styles.trailMarker, layerClass].join(" ")} aria-hidden="true" />;
};
