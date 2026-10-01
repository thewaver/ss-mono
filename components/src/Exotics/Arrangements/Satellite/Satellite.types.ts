import type { CSSPadding, Point2d, Size2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";

export type SatelliteLayoutEntry = {
    size: Size2d;
    placement: AnchorPlacement;
    offset: Point2d;
};

export type SatelliteLayout = {
    padding: CSSPadding;
    satelliteOffsets: Point2d[];
};
