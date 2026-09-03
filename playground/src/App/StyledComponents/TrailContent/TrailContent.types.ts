import type { AccessorProps, TrailPlace } from "@thewaver/ss-components";

export type PageTrailTrackProps = AccessorProps<{
    path: string;
}>;

export type PageTrailVehicleProps = AccessorProps<{
    id: string;
    place: TrailPlace;
    label: string;
}>;

export type PageTrailMarkerProps = AccessorProps<{
    id: string;
}>;
