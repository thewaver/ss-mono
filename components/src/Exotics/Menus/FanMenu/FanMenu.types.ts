import type { BandDefs } from "../../../Generators/PlacementLayouts/PlacementLayouts.types";

export type FanLayoutDefs = Pick<BandDefs, "facingDegrees" | "holeRatio" | "tiltRatio" | "itemRadiusRatio"> & {
    /**
     * The angle each card adds to its level's spread, in degrees, so a level of three opens narrower than a level of
     * eight and the cards sit the same angle apart in both. A level never closes into a whole ring. Defaults to `15`.
     */
    spreadDegreesPerItem?: number;
    /**
     * A card's width, as a share of the width the fan is given. Cards are not held to their share of the ring, so a
     * wide card overlaps its neighbors. Defaults to `0.25`.
     */
    itemWidthRatio?: number;
    /**
     * A card's height, as a share of the width the fan is given — not of the card's own width, so it does not change
     * with `itemWidthRatio`. Defaults to `0.05`.
     */
    itemHeightRatio?: number;
};

export type BaseFanMenuValues = {
    /** How the cards sit on their ring, for the parts of the arrangement the menu does not decide itself. */
    layoutDefs?: FanLayoutDefs;
};

export type BaseFanMenuProps = BaseFanMenuValues;
