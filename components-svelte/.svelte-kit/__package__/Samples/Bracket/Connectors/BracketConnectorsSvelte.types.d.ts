import type { BracketConnectorPaintDefs } from "@thewaver/ss-components";
import type { SvelteMarkup } from "../../../Utils/typeUtils.js";
export type BracketConnectorFn = (paint: BracketConnectorPaintDefs) => SvelteMarkup;
export type BracketConnectorElementProps = {
    /** The connector's two ends, its corner radius, its width and the colors it fades between. */
    paint: BracketConnectorPaintDefs;
    /** The connector's line, as SVG path data. */
    d: string;
    /**
     * A ball drawn over the end the connector runs to and an arrowhead over the end it runs from, or `undefined` for
     * the line alone.
     */
    tips?: {
        /** The ball's radius. */
        ballRadius: number;
        /** The arrowhead's corners, as an SVG `points` list. */
        arrowPoints: string;
    };
};
