import type { AnchorPlacement } from "@thewaver/ss-components-vue";
import type { Point2d } from "@thewaver/ss-utils";

export type SatelliteBadgeCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type SatelliteExampleProps = {
    subjectWidth: number;
    subjectHeight: number;
};

export type SatelliteDefaultExampleProps = SatelliteExampleProps & {
    placement: AnchorPlacement;
    offset: Point2d;
    isBehindSubject: boolean;
    badgeSize: number;
    hasSatellite: boolean;
};

export type SatelliteBadgeExampleProps = SatelliteExampleProps & {
    corner: SatelliteBadgeCorner;
    count: number;
    overhang: number;
};
