import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TrailContent/TrailContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageTrailMarkerProps, PageTrailTrackProps, PageTrailVehicleProps } from "./TrailContent.types";

export const PageTrailTrack = (props: PageTrailTrackProps) => {
    const getLayerClass = useLayerClass();

    return <path class={[styles.trailTrack, getLayerClass()].join(" ")} d={access(props.path)} />;
};

export const PageTrailVehicle = (props: PageTrailVehicleProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div id={access(props.id)} class={[styles.trailVehicle, getLayerClass()].join(" ")} aria-hidden="true">
            {access(props.label)}
        </div>
    );
};

export const PageTrailMarker = (props: PageTrailMarkerProps) => {
    const getLayerClass = useLayerClass();

    return <div id={access(props.id)} class={[styles.trailMarker, getLayerClass()].join(" ")} aria-hidden="true" />;
};
