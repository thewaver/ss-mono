import type { AnchorPlacement } from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

import type { SatelliteBadgeCorner } from "./SatelliteBadgeCorner.types";

export type BaseSatelliteExampleValues = {
    subjectWidth: number;
    subjectHeight: number;
};

export type BaseSatelliteExampleProps = BaseSatelliteExampleValues;

export type BaseSatelliteDefaultExampleValues = {
    placement: AnchorPlacement;
    offset: Point2d;
    isBehindSubject: boolean;
    badgeSize: number;
    hasSatellite: boolean;
};

export type BaseSatelliteDefaultExampleProps = BaseSatelliteExampleProps & BaseSatelliteDefaultExampleValues;

export type BaseSatelliteBadgeExampleValues = {
    corner: SatelliteBadgeCorner;
    count: number;
    overhang: number;
};

export type BaseSatelliteBadgeExampleProps = BaseSatelliteExampleProps & BaseSatelliteBadgeExampleValues;
