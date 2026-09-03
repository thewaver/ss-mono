import { access } from "@thewaver/ss-components";

import type { PageTrailMarkerProps, PageTrailTrackProps, PageTrailVehicleProps } from "./TrailContent.types";

import * as styles from "./TrailContent.css";

export const PageTrailTrack = (props: PageTrailTrackProps) => {
    return <path class={styles.trailTrack} d={access(props.path)} />;
};

export const PageTrailVehicle = (props: PageTrailVehicleProps) => {
    return (
        <div id={access(props.id)} class={styles.trailVehicle} aria-hidden="true">
            {access(props.label)}
        </div>
    );
};

export const PageTrailMarker = (props: PageTrailMarkerProps) => {
    return <div id={access(props.id)} class={styles.trailMarker} aria-hidden="true" />;
};
