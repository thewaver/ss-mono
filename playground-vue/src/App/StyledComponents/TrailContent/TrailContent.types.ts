import type { TrailPlace } from "@thewaver/ss-components-vue";

export type PageTrailTrackProps = {
    path: string;
};

export type PageTrailVehicleProps = {
    id: string;
    place: TrailPlace;
    label: string;
};

export type PageTrailMarkerProps = {
    id: string;
};
