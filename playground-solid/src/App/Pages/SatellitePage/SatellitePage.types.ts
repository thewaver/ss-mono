import type { AccessorProps, AnchorPlacement } from "@thewaver/ss-components-solid";
import type { Point2d } from "@thewaver/ss-utils";

export type SatelliteBadgeCorner = "top_left" | "top_right" | "bottom_left" | "bottom_right";

export type SatelliteExampleProps = AccessorProps<{
    subjectWidth: number;
    subjectHeight: number;
}>;

export type SatelliteDefaultExampleProps = SatelliteExampleProps &
    AccessorProps<{
        placement: AnchorPlacement;
        offset: Point2d;
        isBehindSubject: boolean;
        badgeSize: number;
        hasSatellite: boolean;
    }>;

export type SatelliteBadgeExampleProps = SatelliteExampleProps &
    AccessorProps<{
        corner: SatelliteBadgeCorner;
        count: number;
        overhang: number;
    }>;
