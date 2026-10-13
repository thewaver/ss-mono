import type { TrailPlace } from "@thewaver/ss-components";

export type BasePageTrailTrackValues = {
    path: string;
};

export type BasePageTrailTrackProps = BasePageTrailTrackValues;

export type BasePageTrailVehicleValues = {
    id: string;
    place: TrailPlace;
    label: string;
};

export type BasePageTrailVehicleProps = BasePageTrailVehicleValues;

export type BasePageTrailMarkerValues = {
    id: string;
};

export type BasePageTrailMarkerProps = BasePageTrailMarkerValues;
