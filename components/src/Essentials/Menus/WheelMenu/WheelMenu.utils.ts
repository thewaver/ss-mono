import type { PlacementLayout, PlacementLayoutDefs } from "../../../Abstracts/Placement/Placement.types";
import { PlacementLayoutDefaults } from "../../../Generators/PlacementLayouts/PlacementLayouts.const";
import { PlacementLayoutUtils } from "../../../Generators/PlacementLayouts/PlacementLayouts.utils";
import { WHEEL_MENU_DEFAULTS } from "./WheelMenu.const";
import type { WheelMenuArcRecord, WheelMenuLayoutDefs } from "./WheelMenu.types";

/** A whole turn, in degrees. */
const FULL_TURN_DEGREES = 360;
/** Half of anything. */
const HALF = 0.5;
/** The depth of the first band, round the hole. */
const ROOT_DEPTH = 0;
/** One item, which is also the fewest a share can be split between. */
const SINGLE_ITEM = 1;
/** A diameter is two radii. */
const PAIR = 2;
/** An arc nobody asked for. */
const NO_ARC = 0;
/** The value the close control carries, which no consumer's value can be. */
const CLOSER = Symbol("wheelMenuCloser");

/**
 * How wide the first wedge of a band comes out, given what each wedge asked for.
 *
 * The ring spreads the wedges that named no arc evenly over what the others left, then scales the whole block to
 * the spread. The wheel needs the first wedge's share of that before the ring is built, to turn a full wheel so
 * that its first wedge faces the top.
 */
const toFirstArc = (declared: (number | undefined)[], wedgeCount: number, spreadDegrees: number) => {
    const asked = Array.from({ length: wedgeCount }, (_unused, index) => declared[index]);
    const askedTotal = asked.reduce<number>((sum, arc) => sum + (arc ?? NO_ARC), NO_ARC);
    const freeCount = asked.filter((arc) => arc === undefined).length;
    const evenArc = Math.max(spreadDegrees - askedTotal, NO_ARC) / Math.max(freeCount, SINGLE_ITEM);
    const wanted = asked.map((arc) => arc ?? evenArc);
    const total = wanted.reduce<number>((sum, arc) => sum + arc, NO_ARC);

    return ((wanted[0] ?? NO_ARC) * spreadDegrees) / Math.max(total, Number.EPSILON);
};

/**
 * The wheel's arithmetic: its bands round a hole, one per level, and the close control that sits in the hole.
 *
 * Everything angular about the wheel lives here rather than in `Menu`, which lays the bands out through the
 * layout this computes and never learns that they are bands.
 */
export namespace WheelMenuUtils {
    /** The value the close control carries in the list handed to `Menu`, which no consumer's value can be. */
    export const CLOSER_VALUE: typeof CLOSER = CLOSER;

    /**
     * Whether a value is the close control's.
     *
     * @param value A value from the list handed to `Menu`.
     */
    export const getIsCloser = (value: unknown): value is typeof CLOSER => value === CLOSER;

    /**
     * The list handed to `Menu`: the consumer's items, with the close control after them when there is one.
     *
     * The close control is an ordinary item, which is what gives it a place in the walk, a highlight that
     * excludes every other and an activation that closes the menu. It is named by its own label, since its
     * painter draws a glyph and nothing else.
     *
     * @param items The consumer's items.
     * @param closerAriaLabel The close control's name, or `undefined` for a wheel without one.
     */
    export const withCloser = <TItem>(items: TItem[], closerAriaLabel: string | undefined) =>
        closerAriaLabel === undefined ? items : [...items, { value: CLOSER, ariaLabel: closerAriaLabel }];

    /**
     * The items of the level a path leads to.
     *
     * @param items The first level's items.
     * @param path The index of the item opened at each level, from the first level down.
     */
    export const getItemsAt = (items: WheelMenuArcRecord[], path: number[]) =>
        path.reduce<WheelMenuArcRecord[]>((list, index) => list[index]?.items ?? [], items);

    /**
     * Lays out one band of the wheel.
     *
     * The first band fills the spread and sits round the hole; each band after it sits one band and one gap
     * further out, is only as wide as its wedges need at that radius, and is centered on the wedge that opened
     * it — which is what makes several bands read as one wheel. A wedge may ask for an arc of its own and the
     * rest share what is left. The gap between wedges holds its width rather than its angle as the bands go out.
     * On the first band of a wheel with a close control one more item is placed, in the hole.
     *
     * @param layoutDefs What `Menu` asks the layout for this level.
     * @param defs.items The first level's items, read for the arcs each wedge asked for.
     * @param defs.spreadDegrees How much of the circle the first band covers. A whole turn by default.
     * @param defs.holeRadius The hole's radius.
     * @param defs.bandWidth How thick one band is.
     * @param defs.levelGap The space between one band and the next.
     * @param defs.layoutDefs The ring's own settings, for the parts the wheel does not decide.
     * @param defs.hasCloser Whether the list ends with the close control.
     * @returns The band's layout, with its extent as the band's outer diameter.
     */
    export const computeLayout = (layoutDefs: PlacementLayoutDefs, defs: WheelMenuLayoutDefs): PlacementLayout => {
        const given = defs.layoutDefs ?? {};
        const base = PlacementLayoutDefaults.BAND_DEFAULTS;
        const bandWidth = defs.bandWidth ?? WHEEL_MENU_DEFAULTS.bandWidth;
        const itemRadiusRatio = given.itemRadiusRatio ?? base.itemRadiusRatio;
        const itemMaxWidthRatio = given.itemMaxWidthRatio ?? base.itemMaxWidthRatio;
        const rootHoleRadius = defs.holeRadius ?? WHEEL_MENU_DEFAULTS.holeRadius;
        const rootGapDegrees = given.wedgeGapDegrees ?? base.wedgeGapDegrees;
        const levelGap = defs.levelGap ?? WHEEL_MENU_DEFAULTS.levelGap;
        const path = layoutDefs.path ?? [];
        const depth = path.length;
        const holeRadius = rootHoleRadius + depth * (bandWidth + levelGap);
        const outerRadius = holeRadius + bandWidth;
        const itemRadius = holeRadius + bandWidth * itemRadiusRatio;
        const rootItemRadius = rootHoleRadius + bandWidth * itemRadiusRatio;
        const wedgeGapDegrees = (rootGapDegrees * rootItemRadius) / itemRadius;
        const hasCloser = defs.hasCloser && depth === ROOT_DEPTH;
        const wedgeCount = hasCloser ? layoutDefs.itemCount - SINGLE_ITEM : layoutDefs.itemCount;
        const opener = layoutDefs.parentPlacement?.sector;
        const askedPerWedge =
            PlacementLayoutUtils.toChordAngle(itemRadius, bandWidth * itemMaxWidthRatio) + wedgeGapDegrees;
        const spreadDegrees =
            depth === ROOT_DEPTH
                ? (defs.spreadDegrees ?? FULL_TURN_DEGREES)
                : Math.min(wedgeCount * askedPerWedge, FULL_TURN_DEGREES);
        const computeItemArcs = () => getItemsAt(defs.items, path).map((item) => item.arcDegrees);
        const fillsTurn = spreadDegrees >= FULL_TURN_DEGREES;
        const topFacingDegrees = fillsTurn
            ? base.facingDegrees + (spreadDegrees - toFirstArc(computeItemArcs(), wedgeCount, spreadDegrees)) * HALF
            : base.facingDegrees;
        const facingDegrees = opener
            ? (opener.fromAngle + opener.toAngle) * HALF
            : (given.facingDegrees ?? topFacingDegrees);

        const ring = PlacementLayoutUtils.createRing({
            ...given,
            holeRatio: holeRadius / outerRadius,
            wedgeGapDegrees,
            facingDegrees,
            spreadDegrees,
            computeItemArcs,
        })({ itemCount: wedgeCount });
        const layout = { ...ring, extent: outerRadius * PAIR };

        if (!hasCloser) return layout;

        const origin = layout.origin ?? { x: HALF, y: HALF };
        const closerSize = holeRadius / outerRadius;

        return {
            ...layout,
            placements: [
                ...layout.placements,
                { leftShare: origin.x, topShare: origin.y, widthShare: closerSize, heightShare: closerSize },
            ],
        };
    };
}
