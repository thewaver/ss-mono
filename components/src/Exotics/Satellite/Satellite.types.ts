import type { JSX } from "solid-js";

import type { CSSPadding, Point2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../Abstracts/Anchor/Anchor.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type SatelliteLayout = {
    padding: CSSPadding;
    satelliteOffset: Point2d;
};

export type SatelliteProps = AccessorProps<{
    /** Where the satellite sits against its subject, as one choice across and one down. */
    placement?: AnchorPlacement;
    /** How far the satellite is nudged from where the placement put it. */
    offset?: Point2d;
    /** Puts the satellite under the subject rather than over it, so the subject hides whatever overlaps. */
    isBehindSubject?: boolean;
    /** Draws the satellite. Leave it out and only the subject is rendered. */
    renderSatellite?: () => JSX.Element;
}>;
