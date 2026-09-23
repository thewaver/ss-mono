import type { AccessorProps, AnchorPlacement } from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

export type SatelliteBadgeCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

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
