import type { PlacementLayoutFn } from "../../Abstracts/Placement/Placement.types";
import { PlacementArcUtils } from "./PlacementArc.utils";
import { PlacementCliffUtils } from "./PlacementCliff.utils";
import { PlacementColumnUtils } from "./PlacementColumn.utils";
import { PlacementHoneycombUtils } from "./PlacementHoneycomb.utils";
import type { PlacementLayoutEntry } from "./PlacementLayouts.types";
import { PlacementRingUtils } from "./PlacementRing.utils";
import { PlacementRowUtils } from "./PlacementRow.utils";
import { PlacementWhorlUtils } from "./PlacementWhorl.utils";
import { PlacementZigzagUtils } from "./PlacementZigzag.utils";

/**
 * The arrangements this library ships, as factories a consumer can tune or take as they are.
 *
 * A layout is nothing more than a function from an item count to a list of boxes — see
 * {@link PlacementUtils} for what those boxes mean — so these are examples of writing one rather than
 * the only ones a control will accept. Two families are worth telling apart: a sized layout states the
 * width it was authored at, so a menu can grow its levels in the ratios the layout chose, and a fitted
 * one has no size of its own and fills whatever room it is given.
 *
 * Every number is unit-less. The arrangement is the library's and the pixels are the consumer's, which
 * is the same split an SVG draws.
 */
export namespace PlacementLayoutUtils {
    /** {@link PlacementRingUtils.createRing}: places items round a band, at even angles. */
    export const createRing = PlacementRingUtils.createRing;

    /** {@link createRing} at its defaults. */
    export const ring = createRing();

    /** {@link PlacementArcUtils.createArc}: places items along a piece of an oval, evenly spaced by the distance walked rather than by angle. */
    export const createArc = PlacementArcUtils.createArc;

    /** {@link createArc} at its defaults. */
    export const arc = createArc();

    /** {@link PlacementRowUtils.createRow}: places items in a line across the box, filling its width. */
    export const createRow = PlacementRowUtils.createRow;

    /** {@link createRow} at its defaults. */
    export const row = createRow();

    /** {@link PlacementColumnUtils.createColumn}: places items in a line down the box. */
    export const createColumn = PlacementColumnUtils.createColumn;

    /** {@link createColumn} at its defaults. */
    export const column = createColumn();

    /** {@link PlacementHoneycombUtils.createHoneycomb}: packs items into staggered rows of hexagonal cells. */
    export const createHoneycomb = PlacementHoneycombUtils.createHoneycomb;

    /** {@link createHoneycomb} at its defaults. */
    export const honeycomb = createHoneycomb();

    /** {@link PlacementCliffUtils.createCliff}: steps items down and across in threes, like a stack of cards dealt down a slope. */
    export const createCliff = PlacementCliffUtils.createCliff;

    /** {@link createCliff} at its defaults. */
    export const cliff = createCliff();

    /** {@link PlacementWhorlUtils.createWhorl}: turns items about each other in threes, each group set below the one before it. */
    export const createWhorl = PlacementWhorlUtils.createWhorl;

    /** {@link createWhorl} at its defaults. */
    export const whorl = createWhorl();

    /** {@link PlacementZigzagUtils.createZigzag}: walks items down the box, turning back on itself every few steps. */
    export const createZigzag = PlacementZigzagUtils.createZigzag;

    /** {@link createZigzag} at its defaults. */
    export const zigzag = createZigzag();

    /**
     * Turns a registry entry into the arrangement it names.
     *
     * @param entry The family and, where it has been tuned, the defs to tune it by.
     * @returns The layout function, ready to hand to a control's `computeLayout`.
     */
    export const toLayoutFn = (entry: PlacementLayoutEntry): PlacementLayoutFn => {
        switch (entry.family) {
            case "ring":
                return createRing(entry.defs);
            case "arc":
                return createArc(entry.defs);
            case "row":
                return createRow(entry.defs);
            case "column":
                return createColumn(entry.defs);
            case "honeycomb":
                return createHoneycomb(entry.defs);
            case "cliff":
                return createCliff(entry.defs);
            case "whorl":
                return createWhorl(entry.defs);
            case "zigzag":
                return createZigzag(entry.defs);
        }
    };
}
