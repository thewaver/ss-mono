import type { AccessorProps, AnchorPlacement } from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

export type SatelliteExampleProps = AccessorProps<{
    placement: AnchorPlacement;
    offset: Point2d;
    isBehindSubject: boolean;
    subjectWidth: number;
    subjectHeight: number;
    badgeSize: number;
    hasSatellite: boolean;
}>;
