import type { Quad, Size2d } from "@thewaver/ss-utils";

export type InfiniteCorridorItemState = {
    /** Which item this is, counting the real ones from zero. */
    index: number;
    /** How many items there are. */
    count: number;
    /**
     * How far down the corridor the item is, in items: `0` level with the viewer, rising into the distance, and below
     * `0` while it passes by. Fractional as the corridor moves.
     */
    distance: number;
    /** Whether this is a copy drawn to fill the corridor, rather than the item a keyboard or a reader reaches. */
    isCopy: boolean;
};

export type InfiniteCorridorLayoutDefs = {
    /** How far down the corridor the item is, in items — see {@link InfiniteCorridorItemState.distance}. */
    distance: number;
    /** Which place round the ring of drawn items this is, copies counted, from zero. */
    place: number;
    /** How many places the ring has, copies counted. */
    placeCount: number;
    /** Which real item the place shows, so a copy can be drawn exactly as its original is. */
    index: number;
    /** How many real items there are, so a layout can work out what repeats from one lap to the next. */
    count: number;
    /** The corridor's own box, in pixels. */
    size: Size2d;
};

export type InfiniteCorridorPinnedPlacement = {
    /** How large the item is laid out, in pixels, before it is stretched onto its corners. */
    size: Size2d;
    /**
     * Where the item's four corners are drawn, in pixels on screen from the middle of the box, already seen in
     * perspective — see `QuadUtils`. Neighbors given the same corner points meet exactly. `undefined` where the
     * item cannot be drawn, such as with a corner level with the viewer or behind them, and the item is then hidden.
     */
    corners: Quad | undefined;
    /** How much of the item shows, `0` to `1`. */
    opacity: number;
};

export type InfiniteCorridorTurnedPlacement = {
    /** How large the item is drawn, in pixels, before the perspective shrinks it. */
    size: Size2d;
    /** Where the item's middle sits, in pixels from the middle of the box: across, down, and towards the viewer. */
    offset: { x: number; y: number; z: number };
    /** How far the item is turned about its upright middle line, in degrees, to face across the corridor. */
    turnDegrees: number;
    /**
     * How far the item is rolled round the corridor's own axis, in degrees, clockwise as seen by the viewer — what puts
     * an item on a floor or a ceiling facing inwards rather than on a side wall. Left out, `0`.
     */
    rollDegrees?: number;
    /**
     * How far the item leans back about its level middle line, in degrees, before it is rolled: `90` lays it flat on a
     * floor with its top towards the far end. Left out, `0`.
     */
    tiltDegrees?: number;
    /** How far away the viewer sits, in pixels, which is what makes the far end small. */
    perspectivePx: number;
    /** How much of the item shows, `0` to `1`. */
    opacity: number;
};

export type InfiniteCorridorPlacement = InfiniteCorridorTurnedPlacement | InfiniteCorridorPinnedPlacement;

export type InfiniteCorridorLayoutRule = {
    /** Where one item is drawn, from how far down the corridor it is. */
    place: (defs: InfiniteCorridorLayoutDefs) => InfiniteCorridorPlacement;
    /**
     * The furthest distance down the corridor at which the rule still draws anything. Too few items to fill that far
     * are repeated until they do.
     */
    reach: number;
    /**
     * How far down the corridor an item is put when it is brought into view, which happens when it takes focus from
     * further away or from behind the viewer.
     */
    focusDistance: number;
    /**
     * How far behind the viewer an item is still drawn before it comes round to the far end, in items. A layout that
     * places items in rings says a whole ring, so a ring passes the viewer together rather than leaving one item at a
     * time. Left out, `1`.
     */
    behindDistance?: number;
    /**
     * What the count of drawn items, copies included, must be a multiple of, given how many real items there are. A
     * layout that fills whole rings answers with whatever makes every ring round the corridor complete. Left out, `1`.
     */
    placeMultiple?: (count: number) => number;
};

export type BaseInfiniteCorridorValues<T> = {
    /** The items along the walls, in the order the viewer passes them. */
    items: T[];
    /** How long bringing a focused item into view takes. `0` moves the corridor there at once. */
    glideDurationMs?: number;
    /** Names the corridor for assistive technology. */
    ariaLabel: string;
    /**
     * What the corridor is called when it is announced, so a reader hears corridor rather than region. Defaults to
     * "corridor".
     */
    roleDescription?: string;
};

export type BaseInfiniteCorridorCbs = {
    /**
     * Where each item is drawn, from how far down the corridor it is, and how far the corridor reaches.
     * `CorridorLayoutUtils` ships `walls`, one row on each wall that stands from flat against it to turned towards the
     * viewer, and `tube`, items lining a ring of sides round the axis; a layout of the consumer's own is any object of the
     * same shape.
     */
    layout: InfiniteCorridorLayoutRule;
};

export type BaseInfiniteCorridorProps<T> = BaseInfiniteCorridorValues<T> & BaseInfiniteCorridorCbs;
