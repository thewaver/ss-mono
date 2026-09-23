import type { JSX } from "solid-js";

import type { CSSPadding, Point2d, Size2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../Abstracts/Anchor/Anchor.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type SatelliteLayoutEntry = {
    size: Size2d;
    placement: AnchorPlacement;
    offset: Point2d;
};

export type SatelliteLayout = {
    padding: CSSPadding;
    satelliteOffsets: Point2d[];
};

export type SatelliteDefs = AccessorProps<{
    /** Where this satellite sits against the subject, as one choice across and one down. */
    placement?: AnchorPlacement;
    /** How far this satellite is nudged from where its placement put it, in screen space whatever the placement. */
    offset?: Point2d;
    /** Puts this satellite under the subject rather than over it, so the subject hides whatever overlaps. */
    isBehindSubject?: boolean;
    /** Draws this satellite. */
    renderSatellite: () => JSX.Element;
}>;

export type SatelliteProps = AccessorProps<{
    /**
     * Everything hanging off the subject, each with its own placement, nudge and stacking. The wrapper grows on
     * each side by the furthest any of them overhangs, so one padding covers them all. Leave it out or empty and
     * only the subject is rendered, with no wrapper around it.
     */
    satellites?: SatelliteDefs[];
}>;
