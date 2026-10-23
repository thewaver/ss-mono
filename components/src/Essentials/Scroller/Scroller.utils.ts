import { MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

import { NumberInputUtils } from "../Input/NumberInput/NumberInput.utils";
import { SCROLLER_AXES, SCROLLER_DEFAULTS } from "./Scroller.const";
import type {
    ScrollerActivityDefs,
    ScrollerAxis,
    ScrollerAxisSteps,
    ScrollerBarDefs,
    ScrollerBarSide,
    ScrollerBoxMetrics,
    ScrollerBoxSteps,
    ScrollerButtonPlacement,
    ScrollerGridTemplate,
    ScrollerMetrics,
    ScrollerOverflow,
    ScrollerProgress,
    ScrollerStep,
} from "./Scroller.types";

/** How close to an end, in pixels, counts as being at it, so a fractional scroll position still reads as arrived. */
const SCROLL_EPSILON = 1;
/** The shortest a thumb is drawn, in pixels: the 24-pixel target size WCAG 2.5.8 asks of anything a person drags. */
const MIN_THUMB_LENGTH_PX = 24;
/** How far a press on a thumb must travel, in pixels, before it takes pointer capture and swallows its click. */
const DRAG_THRESHOLD_PX = 4;
/** The pointer button a drag or a track press starts from. */
const PRIMARY_BUTTON = 0;
/** No pointer buttons held, which a move reports once a mouse was released outside the window. */
const NO_BUTTONS = 0;
/** How long a press on a track waits before it starts paging repeatedly. */
const TRACK_PRESS_DELAY_MS = 400;
/** How often a held press on a track pages once it has started repeating. */
const TRACK_PRESS_INTERVAL_MS = 100;
/** Half of anything. */
const HALF = 0.5;
/** The `direction` a right-to-left box computes to. */
const RIGHT_TO_LEFT = "rtl";
/** The size given to the grid track the box sits in, which takes whatever room the step buttons leave. */
const AREA_TRACK = "minmax(0, 1fr)";
/** The size given to a grid track holding step buttons. */
const STEPS_TRACK = "auto";
/** An empty cell in a grid template. */
const EMPTY_CELL = ".";
/** The track a bar's strip takes in the area: as thick as the painter draws it. */
const BAR_TRACK = "auto";

/** The names of the grid cells a scroller lays itself out in. */
const GRID_AREAS = {
    area: "area",
    xLeading: "xLeading",
    xTrailing: "xTrailing",
    yLeading: "yLeading",
    yTrailing: "yTrailing",
} as const;

/**
 * Where each box's latest step on each axis began and where it is heading, kept until the box arrives or is moved
 * elsewhere.
 *
 * A step scrolls smoothly, so for a moment the box sits somewhere between the two; a press in that moment has to be
 * measured from where the box is going rather than from where it happens to be, or it covers less than a page.
 */
const stepsInFlight = new WeakMap<HTMLElement, Partial<Record<ScrollerAxis, { from: number; to: number }>>>();

/** Whether an element lays out right to left, which turns the horizontal axis round. */
const getIsRightToLeft = (element: HTMLElement) => getComputedStyle(element).direction === RIGHT_TO_LEFT;

/**
 * How far a box is scrolled from its start along an axis.
 *
 * A right-to-left box reports `scrollLeft` from `0` downwards, so its size is the distance from the start either way.
 */
const readPosition = (box: HTMLElement, axis: ScrollerAxis) =>
    axis === "x" ? Math.abs(box.scrollLeft) : box.scrollTop;

/** The `scrollTo` options that put a box at a distance from its start along an axis. */
const toScrollOptions = (
    box: HTMLElement,
    axis: ScrollerAxis,
    position: number,
    behavior?: ScrollBehavior,
): ScrollToOptions =>
    axis === "x" ? { left: getIsRightToLeft(box) ? -position : position, behavior } : { top: position, behavior };

/** An element's length along an axis, in layout pixels. */
const readLength = (element: HTMLElement, axis: ScrollerAxis) =>
    axis === "x" ? element.offsetWidth : element.offsetHeight;

/**
 * Where the next step of a box along an axis is measured from: the end of the step already under way, or the box's
 * own position when nothing is.
 *
 * A step counts as under way only while the box lies on the stretch between where it began and where it is heading
 * and has not yet arrived. Anything else — the glide finished, or a wheel, a drag or a focus reveal took the box
 * somewhere off that stretch — means the remembered step no longer describes the box, and it is dropped.
 */
const computeStepOrigin = (box: HTMLElement, axis: ScrollerAxis) => {
    const position = readPosition(box, axis);
    const inFlight = stepsInFlight.get(box)?.[axis];

    if (!inFlight) return position;

    const isOnTheWay =
        position >= Math.min(inFlight.from, inFlight.to) - SCROLL_EPSILON &&
        position <= Math.max(inFlight.from, inFlight.to) + SCROLL_EPSILON;

    if (isOnTheWay && Math.abs(position - inFlight.to) > SCROLL_EPSILON) return inFlight.to;

    delete stepsInFlight.get(box)![axis];

    return position;
};

/** Where an element starts within a box along an axis, from the box's start: the inline start across the page. */
const computeOffsetWithin = (element: HTMLElement, box: HTMLElement, axis: ScrollerAxis) => {
    let offset = 0;
    let node: HTMLElement | null = element;

    while (node && node !== box) {
        offset += axis === "x" ? node.offsetLeft : node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
    }

    if (axis === "x" && getIsRightToLeft(box)) return box.clientWidth - offset - element.offsetWidth;

    return offset;
};

/** How far along a track a client point sits, in client pixels from the track's start. */
const computeClientPosition = (point: Point2d, rect: DOMRect, axis: ScrollerAxis, isRightToLeft: boolean) => {
    if (axis === "y") return point.y - rect.top;

    return isRightToLeft ? rect.right - point.x : point.x - rect.left;
};

/** The center of a box, in client coordinates. */
const getRectCenter = (rect: DOMRect): Point2d => ({
    x: rect.left + rect.width * HALF,
    y: rect.top + rect.height * HALF,
});

/**
 * The parts of a scroller that are not about any framework: what it measures, where a step, a reveal or a drag
 * lands, which buttons it shows and how it lays them out, and the pointer handling of a drawn bar.
 */
export namespace ScrollerUtils {
    /** The progress a box reports along an axis when it is at its start, or has nothing to scroll. */
    export const RATIO_MIN = 0;

    /** The progress of a box that has not been measured yet, or is at its start both ways. */
    export const NO_PROGRESS: ScrollerProgress = { x: RATIO_MIN, y: RATIO_MIN };

    /** The reading of an axis that has not been measured yet. */
    export const NO_METRICS: ScrollerMetrics = { start: 0, visible: 0, total: 0 };

    /** The reading of a box that has not been measured yet. */
    export const NO_BOX_METRICS: ScrollerBoxMetrics = { x: NO_METRICS, y: NO_METRICS };

    /** The names of the cells {@link computeGridTemplate} lays a scroller out in, to give each part its `grid-area`. */
    export const AREAS = GRID_AREAS;

    /**
     * Measures a box along one axis.
     *
     * @param box The scrolling box.
     * @param axis Which way: `x` across the page, `y` down it.
     * @returns How far it is scrolled from its start, how much of it is visible, and how long it is, in layout pixels.
     * A right-to-left box is measured from its right, so the reading means the same either way.
     */
    export const readMetrics = (box: HTMLElement, axis: ScrollerAxis): ScrollerMetrics => ({
        start: readPosition(box, axis),
        visible: axis === "x" ? box.clientWidth : box.clientHeight,
        total: axis === "x" ? box.scrollWidth : box.scrollHeight,
    });

    /**
     * Measures a box along both axes.
     *
     * @param box The scrolling box.
     * @returns Each axis's reading, from {@link readMetrics}.
     */
    export const readBoxMetrics = (box: HTMLElement): ScrollerBoxMetrics => ({
        x: readMetrics(box, "x"),
        y: readMetrics(box, "y"),
    });

    /**
     * Whether two readings of a box are the same, so a view that renders on every new object can skip one that
     * moved nothing.
     *
     * @param a One reading.
     * @param b The other.
     * @returns `true` when every number on both axes matches.
     */
    export const getIsSameBoxMetrics = (a: ScrollerBoxMetrics, b: ScrollerBoxMetrics) =>
        SCROLLER_AXES.every(
            (axis) =>
                a[axis].start === b[axis].start &&
                a[axis].visible === b[axis].visible &&
                a[axis].total === b[axis].total,
        );

    /**
     * Whether an axis is scrolled all the way to its start.
     *
     * @param metrics The axis's reading.
     * @returns `true` within a pixel of the start.
     */
    export const getIsAtStart = (metrics: ScrollerMetrics) => metrics.start <= SCROLL_EPSILON;

    /**
     * Whether an axis is scrolled all the way to its end.
     *
     * @param metrics The axis's reading.
     * @returns `true` within a pixel of the end.
     */
    export const getIsAtEnd = (metrics: ScrollerMetrics) =>
        metrics.start + metrics.visible >= metrics.total - SCROLL_EPSILON;

    /**
     * Whether an axis holds more than it shows, which is what decides whether its buttons are there at all.
     *
     * @param metrics The axis's reading.
     * @returns `true` when the content overruns the box by more than a pixel.
     */
    export const getIsScrollable = (metrics: ScrollerMetrics) => metrics.total > metrics.visible + SCROLL_EPSILON;

    /**
     * How far an axis can travel: its length less what is visible, and never negative.
     *
     * @param metrics The axis's reading.
     * @returns The distance, in layout pixels.
     */
    export const computeScrollRange = (metrics: ScrollerMetrics) => Math.max(metrics.total - metrics.visible, 0);

    /**
     * How far through its run an axis is, as a ratio.
     *
     * @param metrics The axis's reading.
     * @returns The scroll position over the distance there is to travel, clamped into 0..1, and zero when nothing
     * overflows.
     */
    export const computeProgressRatio = (metrics: ScrollerMetrics) => {
        const range = computeScrollRange(metrics);

        return range === 0 ? RATIO_MIN : MathUtils.clamp01(metrics.start / range);
    };

    /**
     * How far through its run a box is on both axes.
     *
     * @param metrics The box's reading.
     * @returns Each axis's {@link computeProgressRatio}.
     */
    export const computeProgress = (metrics: ScrollerBoxMetrics): ScrollerProgress => ({
        x: computeProgressRatio(metrics.x),
        y: computeProgressRatio(metrics.y),
    });

    /**
     * Whether two progress values are the same on both axes.
     *
     * @param a One value.
     * @param b The other.
     * @returns `true` when both ratios match exactly.
     */
    export const getIsSameProgress = (a: ScrollerProgress, b: ScrollerProgress) => a.x === b.x && a.y === b.y;

    /**
     * Which way a box lays its children out.
     *
     * A box scrolling only down the page stacks them in a column; anything else — across only, both ways, or
     * neither — keeps them in a row, which is how a box scrolling both ways holds one wide and tall child.
     *
     * @param overflowX Whether the box scrolls across.
     * @param overflowY Whether it scrolls down.
     * @returns `y` for a column, `x` for a row.
     */
    export const getRunAxis = (overflowX: ScrollerOverflow, overflowY: ScrollerOverflow): ScrollerAxis =>
        overflowX === "hidden" && overflowY !== "hidden" ? "y" : "x";

    /**
     * Whether an axis shows a bar: always under `scroll`, never under `hidden`, and under `auto` only while it
     * overflows.
     *
     * @param overflow How the axis was asked to scroll.
     * @param metrics The axis's reading.
     * @returns `true` when a bar should be drawn.
     */
    export const getHasBar = (overflow: ScrollerOverflow, metrics: ScrollerMetrics) =>
        overflow === "scroll" || (overflow === "auto" && getIsScrollable(metrics));

    /**
     * Where a box has to scroll to along one axis so a child shows whole, with `padding` of room clear of the edge.
     *
     * A child already fully in view leaves the box where it is; one cut off by an edge moves it by the least that
     * shows it, rather than centering it, so a half-clicked item is not dragged out from under the pointer.
     *
     * @param box The scrolling box.
     * @param target The element to reveal, anywhere inside the box.
     * @param padding The room to leave between the element and the edge, for its focus ring.
     * @param axis Which way.
     * @returns The distance from the box's start to scroll to.
     */
    export const computeRevealTarget = (box: HTMLElement, target: HTMLElement, padding: number, axis: ScrollerAxis) => {
        const { start, visible } = readMetrics(box, axis);
        const offset = computeOffsetWithin(target, box, axis);
        const length = readLength(target, axis);

        if (offset - padding < start) return offset - padding;

        return offset + length + padding > start + visible ? offset + length + padding - visible : start;
    };

    /**
     * Scrolls a box so a child shows whole along each of the given axes, in one move, by
     * {@link computeRevealTarget}'s rule.
     *
     * @param box The scrolling box.
     * @param target The element to reveal, anywhere inside the box.
     * @param padding The room to leave between the element and the edge.
     * @param axes The axes the box scrolls along. An axis left out is not moved.
     */
    export const reveal = (box: HTMLElement, target: HTMLElement, padding: number, axes: ScrollerAxis[]) => {
        if (axes.length === 0) return;

        box.scrollTo(
            Object.assign(
                {},
                ...axes.map((axis) => toScrollOptions(box, axis, computeRevealTarget(box, target, padding, axis))),
            ),
        );
    };

    /**
     * Scrolls a box to a share of its run along each axis given, in one move.
     *
     * @param box The scrolling box.
     * @param ratios How far along each axis to go, from `0` to `1`; values outside are held inside. An axis left out
     * is not moved.
     * @param behavior `instant` for a move that must keep up with a pointer; left out, the box's own
     * `scroll-behavior` decides.
     */
    export const scrollToRatios = (box: HTMLElement, ratios: Partial<ScrollerProgress>, behavior?: ScrollBehavior) => {
        const axes = SCROLLER_AXES.filter((axis) => ratios[axis] !== undefined);

        if (axes.length === 0) return;

        box.scrollTo(
            Object.assign(
                {},
                ...axes.map((axis) =>
                    toScrollOptions(
                        box,
                        axis,
                        MathUtils.clamp01(ratios[axis]!) * computeScrollRange(readMetrics(box, axis)),
                        behavior,
                    ),
                ),
            ),
        );
    };

    /**
     * Where one step lands, from where the items start.
     *
     * A step goes about one view in its direction and lands on an item boundary: forward, on the furthest item start
     * still within the next view; back, on the nearest item start within the previous one. Where there is no boundary
     * inside the page — a box holding one item — it goes a full view. Before the box has scrolled past the first
     * item's start, which leading padding puts a little way in, that item already counts as lined up, so a step never
     * lands on it.
     *
     * Each item of overlap pulls the landing one boundary back towards where the step began, so that item of the
     * view just left is still in view afterwards. The landing never comes back past the first boundary the step
     * crosses, so a step moves by at least one item whatever the overlap.
     *
     * @param offsets Where each item starts along the axis, in order.
     * @param visible How much of the box is in view along the axis.
     * @param step Which way.
     * @param start Where the step is measured from.
     * @param overlapCount How many items of the view just left stay in view. Negative or fractional counts are held
     * to a whole number from zero.
     * @returns The distance from the start to go to, which the caller holds within the box's range.
     */
    export const computeStepLanding = (
        offsets: number[],
        visible: number,
        step: ScrollerStep,
        start: number,
        overlapCount = SCROLLER_DEFAULTS.overlapCount,
    ) => {
        const overlap = Number.isFinite(overlapCount) ? Math.max(Math.floor(overlapCount), 0) : 0;

        if (step === "next") {
            const limit = start + visible;
            const firstOffset = offsets[0];
            const lineUp = firstOffset !== undefined && start < firstOffset ? firstOffset : start;
            const candidates = offsets.filter((offset) => offset > lineUp + SCROLL_EPSILON && offset <= limit);

            return candidates[Math.max(candidates.length - 1 - overlap, 0)] ?? limit;
        }

        const limit = start - visible;
        const candidates = offsets.filter((offset) => offset < start - SCROLL_EPSILON && offset >= limit);

        return candidates[Math.min(overlap, candidates.length - 1)] ?? limit;
    };

    /**
     * Where one step of a box along an axis lands.
     *
     * Reads where the box's children start along the axis and how much is in view, and hands them to
     * {@link computeStepLanding}.
     *
     * @param box The scrolling box.
     * @param step Which way.
     * @param axis Along which axis.
     * @param start Where to measure the step from. Defaults to where the box is scrolled to now.
     * @param overlapCount How many items of the view just left stay in view.
     * @returns The distance from the start to go to.
     */
    export const computeStepTarget = (
        box: HTMLElement,
        step: ScrollerStep,
        axis: ScrollerAxis,
        start = readPosition(box, axis),
        overlapCount = SCROLLER_DEFAULTS.overlapCount,
    ) => {
        const offsets = [...box.children].map((child) => computeOffsetWithin(child as HTMLElement, box, axis));

        return computeStepLanding(offsets, readMetrics(box, axis).visible, step, start, overlapCount);
    };

    /**
     * Scrolls a box one step along an axis, unless it is already at the end that step goes towards.
     *
     * A press made while an earlier step is still gliding is measured from where that step is heading, so five quick
     * presses go five pages, as five slow ones do; see {@link computeStepTarget}. Once the box arrives, or is
     * scrolled somewhere off its way, the next press is measured from where it is.
     *
     * @param box The scrolling box, once it exists.
     * @param step Which way.
     * @param axis Along which axis.
     * @param overlapCount How many items of the view just left stay in view.
     * @returns `true` when it scrolled, `false` at the matching end or with no box.
     */
    export const stepTo = (
        box: HTMLElement | undefined,
        step: ScrollerStep,
        axis: ScrollerAxis,
        overlapCount = SCROLLER_DEFAULTS.overlapCount,
    ) => {
        if (!box) return false;

        const origin = computeStepOrigin(box, axis);
        const metrics = { ...readMetrics(box, axis), start: origin };

        if (step === "previous" ? getIsAtStart(metrics) : getIsAtEnd(metrics)) return false;

        const target = MathUtils.clamp(
            computeStepTarget(box, step, axis, origin, overlapCount),
            0,
            computeScrollRange(metrics),
        );

        stepsInFlight.set(box, { ...stepsInFlight.get(box), [axis]: { from: readPosition(box, axis), to: target } });
        box.scrollTo(toScrollOptions(box, axis, target));

        return true;
    };

    /**
     * Which step buttons go before the box and which after it, along one axis.
     *
     * `split` puts one on each side, `start` and `end` put both on that side, and an axis with nothing to scroll gets
     * none at all.
     *
     * @param placement Where the buttons sit.
     * @param isScrollable Whether the axis has anything to scroll.
     * @returns The steps to render before the box, and after it.
     */
    export const getSteps = (placement: ScrollerButtonPlacement, isScrollable: boolean): ScrollerAxisSteps => {
        if (!isScrollable) return { leading: [], trailing: [] };
        if (placement === "start") return { leading: ["previous", "next"], trailing: [] };
        if (placement === "end") return { leading: [], trailing: ["previous", "next"] };

        return { leading: ["previous"], trailing: ["next"] };
    };

    /**
     * Which step buttons each axis shows: {@link getSteps} for an axis that scrolls, and none for a `hidden` one.
     *
     * @param placement Where the buttons sit, for both axes alike.
     * @param overflow How each axis was asked to scroll.
     * @param metrics The box's reading.
     * @returns The steps to render before and after the box, per axis.
     */
    export const getBoxSteps = (
        placement: ScrollerButtonPlacement,
        overflow: Record<ScrollerAxis, ScrollerOverflow>,
        metrics: ScrollerBoxMetrics,
    ): ScrollerBoxSteps => ({
        x: getSteps(placement, overflow.x !== "hidden" && getIsScrollable(metrics.x)),
        y: getSteps(placement, overflow.y !== "hidden" && getIsScrollable(metrics.y)),
    });

    /**
     * The grid a scroller lays itself out in: the box's cell in the middle, a column before and after it for the
     * buttons stepping across, and a row above and below for those stepping down.
     *
     * Only the rows and columns that hold buttons are written, so a gap is never left around an empty one.
     *
     * @param steps The buttons each axis shows, from {@link getBoxSteps}.
     * @returns The `grid-template-areas`, `grid-template-columns` and `grid-template-rows`, naming the cells
     * {@link AREAS} lists.
     */
    export const computeGridTemplate = (steps: ScrollerBoxSteps): ScrollerGridTemplate => {
        const columns = [
            ...(steps.x.leading.length > 0 ? [GRID_AREAS.xLeading] : []),
            GRID_AREAS.area,
            ...(steps.x.trailing.length > 0 ? [GRID_AREAS.xTrailing] : []),
        ];
        const rows = [
            ...(steps.y.leading.length > 0 ? [GRID_AREAS.yLeading] : []),
            GRID_AREAS.area,
            ...(steps.y.trailing.length > 0 ? [GRID_AREAS.yTrailing] : []),
        ];
        const toTrack = (name: string) => (name === GRID_AREAS.area ? AREA_TRACK : STEPS_TRACK);
        const toCell = (row: string, column: string) => {
            if (row === GRID_AREAS.area) return column;

            return column === GRID_AREAS.area ? row : EMPTY_CELL;
        };

        return {
            areas: rows.map((row) => `"${columns.map((column) => toCell(row, column)).join(" ")}"`).join(" "),
            columns: columns.map(toTrack).join(" "),
            rows: rows.map(toTrack).join(" "),
        };
    };

    /**
     * The layout of the box and its two bars inside the scroller's area.
     *
     * Each bar's strip sits on the side asked for, so the across bar goes above or below the box and the down bar
     * before or after it in reading order; the corner where the two strips meet stays empty.
     *
     * @param sides Which side each bar sits on.
     * @returns The `grid-template-areas`, `grid-template-columns` and `grid-template-rows` for the area.
     */
    export const computeAreaTemplate = (sides: Record<ScrollerAxis, ScrollerBarSide>): ScrollerGridTemplate => {
        const isYBarFirst = sides.y === "start";
        const isXBarFirst = sides.x === "start";
        const boxRow = isYBarFirst ? ["yBar", "box"] : ["box", "yBar"];
        const barRow = isYBarFirst ? ["corner", "xBar"] : ["xBar", "corner"];
        const rows = isXBarFirst ? [barRow, boxRow] : [boxRow, barRow];

        return {
            areas: rows.map((row) => `"${row.join(" ")}"`).join(" "),
            columns: isYBarFirst ? `${BAR_TRACK} ${AREA_TRACK}` : `${AREA_TRACK} ${BAR_TRACK}`,
            rows: isXBarFirst ? `${BAR_TRACK} ${AREA_TRACK}` : `${AREA_TRACK} ${BAR_TRACK}`,
        };
    };

    /**
     * How long a bar's thumb is.
     *
     * The thumb's share of the track is the share of the content in view, held at 24 pixels or more so it stays a
     * target a person can hit, and never longer than the track — a track shorter than 24 pixels gets a thumb that
     * fills it.
     *
     * @param metrics The reading of the axis the bar runs along.
     * @param trackLength How long the track is, in pixels.
     * @returns The thumb's length, in pixels; `0` for a track with no length.
     */
    export const computeThumbLength = (metrics: ScrollerMetrics, trackLength: number) => {
        if (trackLength <= 0) return 0;

        const share = metrics.total > 0 ? Math.min(metrics.visible / metrics.total, 1) : 1;

        return MathUtils.clamp(trackLength * share, Math.min(MIN_THUMB_LENGTH_PX, trackLength), trackLength);
    };

    /**
     * How far a thumb sits from its track's start.
     *
     * @param ratio How far along the axis the box is scrolled, from `0` to `1`; values outside are held inside.
     * @param trackLength How long the track is.
     * @param thumbLength How long the thumb is, from {@link computeThumbLength}.
     * @returns The distance, in the units of the two lengths, so the thumb meets the track's end at `1`.
     */
    export const computeThumbOffset = (ratio: number, trackLength: number, thumbLength: number) =>
        MathUtils.clamp01(ratio) * Math.max(trackLength - thumbLength, 0);

    /**
     * The progress that puts a thumb's middle at a point along a straight track.
     *
     * @param position How far along the track the point is, from its start.
     * @param trackLength How long the track is.
     * @param thumbLength How long the thumb is.
     * @returns A ratio from `0` to `1`: a point nearer an end than half the thumb reads as that end, and a track no
     * longer than its thumb reads as `0`.
     */
    export const computeRatioAtPosition = (position: number, trackLength: number, thumbLength: number) => {
        const travel = trackLength - thumbLength;

        return travel <= 0 ? RATIO_MIN : MathUtils.clamp01((position - thumbLength * HALF) / travel);
    };

    /**
     * How far either side of its own progress a thumb covers, as progress.
     *
     * A press whose progress is closer than this to the thumb's is on the thumb, which is where a held press on the
     * track stops paging.
     *
     * @param trackLength How long the track is.
     * @param thumbLength How long the thumb is.
     * @returns Half the thumb over the distance it can travel; `Infinity` when it cannot travel at all.
     */
    export const computeThumbReach = (trackLength: number, thumbLength: number) => {
        const travel = trackLength - thumbLength;

        return travel <= 0 ? Number.POSITIVE_INFINITY : (thumbLength * HALF) / travel;
    };

    /**
     * Which way a press on a track pages: towards the press, or nowhere once the thumb has reached it.
     *
     * @param pressedRatio The progress at the press.
     * @param ratio The progress the thumb is at, or heading to.
     * @param reach How far either side of its progress the thumb covers, from {@link computeThumbReach}.
     * @returns `next` for a press beyond the thumb, `previous` for one before it, and `undefined` for one it covers.
     */
    export const computeTrackPressStep = (
        pressedRatio: number,
        ratio: number,
        reach: number,
    ): ScrollerStep | undefined => {
        if (Math.abs(pressedRatio - ratio) <= reach) return undefined;

        return pressedRatio > ratio ? "next" : "previous";
    };

    /**
     * The pointer handling of one drawn bar: dragging its thumb, and pressing its track.
     *
     * A press on the thumb drags it. It follows the pointer straight along the track, keeping the spot that was
     * grabbed under the pointer, or through `computeProgressAtPoint` when there is one; the box keeps up instantly
     * rather than gliding. Pointer capture is taken only once the press has traveled a few pixels, and the click a
     * drag ends with is swallowed.
     *
     * A press on the track pages one view towards the press, and keeps paging while it is held, the way a step button
     * held down would — towards wherever the pointer has moved to, and stopping once the thumb reaches it. With Alt
     * (Option on a Mac) held, the press jumps to the spot instead and drags from there.
     *
     * @param defs The bar's axis, its box, track and thumb, the overlap a page keeps, the point formula, and where to
     * report a drag starting and ending — all read at the moment they are needed.
     * @returns `press` for a `pointerdown` anywhere on the bar, which ignores presses outside the track;
     * `swallowClick` for a `click` listener the scroller's root takes in the capture phase; and `stop`, which abandons
     * any press in flight and takes its document listeners away.
     */
    export const createBar = (defs: ScrollerBarDefs) => {
        let press:
            | {
                  pointerId: number;
                  origin: Point2d;
                  point: Point2d;
                  grabOffset?: number;
                  step?: ScrollerStep;
                  hasMoved: boolean;
                  capturedBy?: HTMLElement;
              }
            | undefined;
        let isClickSwallowed = false;

        const repeater = NumberInputUtils.createStepRepeater({
            getDelayMs: () => TRACK_PRESS_DELAY_MS,
            getIntervalMs: () => TRACK_PRESS_INTERVAL_MS,
        });

        const readThumbLength = (trackRect: DOMRect) => {
            const thumb = defs.getThumb();
            const box = defs.getBox();

            if (thumb) {
                const rect = thumb.getBoundingClientRect();

                return defs.axis === "x" ? rect.width : rect.height;
            }

            const trackLength = defs.axis === "x" ? trackRect.width : trackRect.height;

            return box ? computeThumbLength(readMetrics(box, defs.axis), trackLength) : 0;
        };

        const computePointerRatio = (point: Point2d, grabOffset = 0) => {
            const track = defs.getTrack();

            if (!track) return undefined;

            const rect = track.getBoundingClientRect();
            const compute = defs.getComputeProgressAtPoint();

            if (compute) return MathUtils.clamp01(compute(defs.axis, point, rect));

            const position = computeClientPosition(point, rect, defs.axis, getIsRightToLeft(track));

            return computeRatioAtPosition(
                position - grabOffset,
                defs.axis === "x" ? rect.width : rect.height,
                readThumbLength(rect),
            );
        };

        const readReach = () => {
            const track = defs.getTrack();

            if (!track) return 0;

            const rect = track.getBoundingClientRect();

            return computeThumbReach(defs.axis === "x" ? rect.width : rect.height, readThumbLength(rect));
        };

        const computeHeadingRatio = (box: HTMLElement) => {
            const range = computeScrollRange(readMetrics(box, defs.axis));

            return range === 0 ? RATIO_MIN : MathUtils.clamp01(computeStepOrigin(box, defs.axis) / range);
        };

        const stepTowardsPress = () => {
            const box = defs.getBox();

            if (!box || !press?.step) return false;

            const pressedRatio = computePointerRatio(press.point);

            if (pressedRatio === undefined) return false;

            const step = computeTrackPressStep(pressedRatio, computeHeadingRatio(box), readReach());

            if (step !== press.step) return false;

            return stepTo(box, step, defs.axis, defs.getOverlapCount());
        };

        const handleMove = (e: PointerEvent) => {
            if (!press || e.pointerId !== press.pointerId) return;

            if (e.buttons === NO_BUTTONS) {
                stop();

                return;
            }

            press.point = { x: e.clientX, y: e.clientY };

            if (press.grabOffset === undefined) return;

            e.preventDefault();

            if (!press.hasMoved && Point2dUtils.getDistance(press.origin, press.point) >= DRAG_THRESHOLD_PX) {
                const track = defs.getTrack();

                press.hasMoved = true;

                if (track) {
                    track.setPointerCapture(e.pointerId);
                    press.capturedBy = track;
                }
            }

            const box = defs.getBox();
            const ratio = computePointerRatio(press.point, press.grabOffset);

            if (!box || ratio === undefined) return;

            scrollToRatios(box, { [defs.axis]: ratio }, "instant");
        };

        const handleEnd = (e: PointerEvent) => {
            if (!press || e.pointerId !== press.pointerId) return;

            isClickSwallowed = press.hasMoved;

            stop();
        };

        const listen = (pointerId: number, point: Point2d, fields: { grabOffset?: number; step?: ScrollerStep }) => {
            press = { pointerId, origin: point, point, hasMoved: false, ...fields };

            document.addEventListener("pointermove", handleMove);
            document.addEventListener("pointerup", handleEnd);
            document.addEventListener("pointercancel", handleEnd);

            if (fields.grabOffset !== undefined) defs.onDraggingChange(true);
        };

        const stop = () => {
            repeater.stop();

            if (press?.capturedBy?.hasPointerCapture(press.pointerId)) {
                press.capturedBy.releasePointerCapture(press.pointerId);
            }

            const wasDragging = press?.grabOffset !== undefined;

            press = undefined;

            document.removeEventListener("pointermove", handleMove);
            document.removeEventListener("pointerup", handleEnd);
            document.removeEventListener("pointercancel", handleEnd);

            if (wasDragging) defs.onDraggingChange(false);
        };

        return {
            press: (e: PointerEvent) => {
                isClickSwallowed = false;

                if (press || e.button !== PRIMARY_BUTTON) return;

                const box = defs.getBox();
                const track = defs.getTrack();
                const target = e.target;

                if (!box || !track || !(target instanceof Node) || !track.contains(target)) return;

                e.preventDefault();

                const point = { x: e.clientX, y: e.clientY };
                const thumb = defs.getThumb();

                if (thumb?.contains(target)) {
                    const rect = track.getBoundingClientRect();
                    const isRightToLeft = getIsRightToLeft(track);
                    const thumbCenter = getRectCenter(thumb.getBoundingClientRect());

                    listen(e.pointerId, point, {
                        grabOffset:
                            computeClientPosition(point, rect, defs.axis, isRightToLeft) -
                            computeClientPosition(thumbCenter, rect, defs.axis, isRightToLeft),
                    });

                    return;
                }

                const pressedRatio = computePointerRatio(point);

                if (pressedRatio === undefined) return;

                if (e.altKey) {
                    scrollToRatios(box, { [defs.axis]: pressedRatio }, "instant");
                    listen(e.pointerId, point, { grabOffset: 0 });

                    return;
                }

                const step = computeTrackPressStep(pressedRatio, computeHeadingRatio(box), readReach());

                if (!step) return;

                listen(e.pointerId, point, { step });

                if (!repeater.start(stepTowardsPress)) stop();
            },
            swallowClick: (e: MouseEvent) => {
                if (!isClickSwallowed) return;

                isClickSwallowed = false;

                e.preventDefault();
                e.stopPropagation();
            },
            stop,
        };
    };

    /**
     * Watches what decides whether an auto-hiding bar shows: the box scrolling, and the pointer over the scroller.
     *
     * Scrolling counts from each scroll the box makes until `getHideDelayMs` after the last. Hovering counts only from
     * the pointer really moving over the root, so content moving under a still pointer does not bring a bar back, and
     * a touch, which cannot hover, never counts.
     *
     * @param root The scroller's outermost element, which the pointer is over.
     * @param box The scrolling box.
     * @param defs How long scrolling lasts after the last scroll, and where to report each change.
     * @returns A function that stops watching, cancels a pending end of scrolling, and reports both as `false`.
     */
    export const observeActivity = (root: HTMLElement, box: HTMLElement, defs: ScrollerActivityDefs) => {
        let scrollingTimer: ReturnType<typeof setTimeout> | undefined;

        const onScroll = () => {
            defs.onScrollingChange(true);

            clearTimeout(scrollingTimer);

            scrollingTimer = setTimeout(() => defs.onScrollingChange(false), defs.getHideDelayMs());
        };

        const onPointerMove = (e: PointerEvent) => {
            if (e.pointerType === "touch") return;

            defs.onHoveredChange(true);
        };

        const onPointerLeave = () => defs.onHoveredChange(false);

        box.addEventListener("scroll", onScroll, { passive: true });
        root.addEventListener("pointermove", onPointerMove);
        root.addEventListener("pointerleave", onPointerLeave);

        return () => {
            clearTimeout(scrollingTimer);

            box.removeEventListener("scroll", onScroll);
            root.removeEventListener("pointermove", onPointerMove);
            root.removeEventListener("pointerleave", onPointerLeave);

            defs.onScrollingChange(false);
            defs.onHoveredChange(false);
        };
    };

    /**
     * Watches how long a bar's track is along its axis.
     *
     * @param track The track the painter handed over.
     * @param axis Which way the bar runs.
     * @param onLength Receives each new length, in layout pixels, and once at the start.
     * @returns A function that stops watching.
     */
    export const observeTrackLength = (track: HTMLElement, axis: ScrollerAxis, onLength: (length: number) => void) => {
        const update = () => onLength(readLength(track, axis));
        const observer = new ResizeObserver(update);

        observer.observe(track);

        update();

        return () => observer.disconnect();
    };

    /**
     * Watches a box for everything that changes its reading.
     *
     * The box and each of its children are watched for size, children arriving later are picked up, and the box's
     * own scroll is followed. The callback runs once at the start.
     *
     * @param box The scrolling box.
     * @param onMetrics Receives each new reading, on both axes.
     * @returns A function that stops watching.
     */
    export const observe = (box: HTMLElement, onMetrics: (metrics: ScrollerBoxMetrics) => void) => {
        const update = () => onMetrics(readBoxMetrics(box));
        const sizeObserver = new ResizeObserver(update);
        const childObserver = new MutationObserver(() => {
            for (const child of box.children) sizeObserver.observe(child);

            update();
        });

        sizeObserver.observe(box);

        for (const child of box.children) sizeObserver.observe(child);

        childObserver.observe(box, { childList: true });
        box.addEventListener("scroll", update, { passive: true });

        update();

        return () => {
            sizeObserver.disconnect();
            childObserver.disconnect();
            box.removeEventListener("scroll", update);
        };
    };
}
