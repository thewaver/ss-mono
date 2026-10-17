import { MathUtils } from "@thewaver/ss-utils";
import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { QuadWarpCorners } from "../../../Abstracts/QuadWarp/QuadWarp.types";
import { QuadWarpUtils } from "../../../Abstracts/QuadWarp/QuadWarp.utils";
import { CarouselUtils } from "../../../Essentials/Carousel/Carousel.utils";
import type { InfiniteCorridorPlacement } from "./InfiniteCorridor.types";

const BEHIND_DISTANCE = 1;
const NO_TURN = 0;
const HALF = 0.5;
const IN_VIEW_FAR_FACTOR = 2;
const LAYER_RESOLUTION = 100;
const ECHO_TOLERANCE = 0.01;
const ECHO_MEMORY = 4;
const HIDDEN = "0";
const CENTERED_ORIGIN = "50% 50%";
const CORNER_ORIGIN = "0 0";

const wrap = (value: number, length: number) => ((value % length) + length) % length;

/** Corners measured from the middle of the box, measured instead from the top left of an item centered there. */
const toItemCorners = (corners: QuadWarpCorners, size: Size2d): QuadWarpCorners => {
    const shift = (point: Point2d) => ({ x: point.x + size.width * HALF, y: point.y + size.height * HALF });

    return {
        top_left: shift(corners.top_left),
        top_right: shift(corners.top_right),
        bottom_right: shift(corners.bottom_right),
        bottom_left: shift(corners.bottom_left),
    };
};

const greatestCommonDivisor = (a: number, b: number): number => (b === 0 ? a : greatestCommonDivisor(b, a % b));

/**
 * The arithmetic behind `InfiniteCorridor`: where the corridor is from its `progress`, how many times its items are
 * drawn, how far down the corridor each drawn item stands, which drawn item is the real one, and where to move to
 * bring an item into view. Each framework's view tracks the progress, draws the items and writes the styles these
 * give.
 */
export namespace InfiniteCorridorUtils {
    /**
     * Where a progress puts the corridor, in items walked past.
     *
     * The corridor never ends, so `0` to `1` is one whole lap of the items and any progress outside it is brought back
     * into the lap, `1` included, which is the start again.
     *
     * @param progress How far along, any number.
     * @param count How many items there are.
     * @returns A position from `0` up to `count`.
     */
    export const toPosition = (progress: number, count: number) => wrap(progress, 1) * count;

    /**
     * The progress that describes a position, the reverse of {@link toPosition}.
     *
     * @param position A position in items, which may have run past either end of the lap while gliding.
     * @param count How many items there are.
     * @returns `0` up to `1`, and `0` with no items.
     */
    export const toProgress = (position: number, count: number) => (count > 0 ? wrap(position / count, 1) : 0);

    /**
     * How many times the items are drawn, so the corridor is full as far down as the layout reaches.
     *
     * The ring of drawn items has to hold every place from behind the viewer, where an item is passing by, out to the
     * layout's reach; the whole list is repeated rather than single items, so every item keeps its neighbors. When the
     * layout fills whole rings, the count is raised until every ring is complete, so with 7 items and rings of 12 the
     * list is drawn 12 times.
     *
     * @param count How many items there are.
     * @param reach How far down the corridor the layout draws — see `InfiniteCorridorLayoutRule.reach`.
     * @param behindDistance How far behind the viewer the layout still draws. Left out, `1`.
     * @param placeMultiple What the count of drawn items must be a multiple of. Left out, `1`.
     * @returns How many times the list is drawn, at least `1`.
     */
    export const getCopyCount = (count: number, reach: number, behindDistance = BEHIND_DISTANCE, placeMultiple = 1) => {
        if (count < 1) return 1;

        const fewest = Math.max(1, Math.ceil((reach + behindDistance + 1) / count));
        const step = placeMultiple / greatestCommonDivisor(count, placeMultiple);

        return Math.ceil(fewest / step) * step;
    };

    /**
     * Where the corridor is round its ring of drawn items, following its position as it moves, so the ring walks on
     * through every lap instead of jumping back to its first copy. The same rule `Carousel` follows its copies by —
     * see `CarouselUtils.followCopies`.
     *
     * @param previous Where the ring was, or `undefined` before it had been placed.
     * @param position Where the corridor is, from {@link toPosition}.
     * @param count How many items there are.
     * @param copies How many times the list is drawn, from {@link getCopyCount}.
     * @returns A position round the ring of `count × copies`.
     */
    export const followCopies = (previous: number | undefined, position: number, count: number, copies: number) =>
        CarouselUtils.followCopies(previous, position, count, copies);

    /**
     * How far down the corridor one drawn item stands.
     *
     * The ring is measured forwards from the viewer, so almost all of it lies ahead: an item is behind only while it
     * is within the layout's behind distance of having passed, and then it comes round to the far end.
     *
     * @param place The drawn item's place round the ring.
     * @param ringPosition Where the corridor is round the ring, from {@link followCopies}.
     * @param placeCount How many places the ring has.
     * @param behindDistance How far behind the viewer the layout still draws. Left out, `1`.
     * @returns The distance in items, from just past the behind distance below `0` up to the far end of the ring.
     */
    export const getDistance = (
        place: number,
        ringPosition: number,
        placeCount: number,
        behindDistance = BEHIND_DISTANCE,
    ) => {
        if (placeCount <= 0) return 0;

        const forward = wrap(place - ringPosition, placeCount);

        return forward > placeCount - behindDistance ? forward - placeCount : forward;
    };

    /**
     * Which drawn item is the real one for an item: the nearest copy still ahead of the viewer.
     *
     * Every other copy is kept out of the keyboard and out of a screen reader. When the real one passes behind the
     * viewer the next copy along takes over, which is the moment anything focused inside it loses focus. Copies behind
     * the viewer never count, so a layout that draws a whole ring behind does not leave its real items out of sight.
     *
     * @param index The item.
     * @param ringPosition Where the corridor is round the ring.
     * @param count How many items there are.
     * @param copies How many times the list is drawn.
     * @param behindDistance How far behind the viewer the layout still draws. Left out, `1`.
     * @returns The real copy's place round the ring.
     */
    export const getRealPlace = (
        index: number,
        ringPosition: number,
        count: number,
        copies: number,
        behindDistance = BEHIND_DISTANCE,
    ) => {
        const placeCount = count * copies;
        let nearest = index;
        let nearestDistance = Infinity;

        for (let copy = 0; copy < copies; copy++) {
            const place = index + copy * count;
            const distance = getDistance(place, ringPosition, placeCount, behindDistance);

            if (distance >= 0 && distance < nearestDistance) {
                nearest = place;
                nearestDistance = distance;
            }
        }

        return nearest;
    };

    /**
     * How far down the corridor a focused item is brought, held short of where a nearer copy would take over.
     *
     * Copies of an item stand one item count apart, so with fewer items than the layout's focus distance the item's
     * next copy towards the viewer would be the real one once the item got there; the distance is held below the item
     * count.
     *
     * @param focusDistance The layout's — see `InfiniteCorridorLayoutRule.focusDistance`.
     * @param count How many items there are.
     */
    export const getFocusDistance = (focusDistance: number, count: number) =>
        Math.min(focusDistance, Math.max(count - 1, 0));

    /**
     * Whether an item stands where a viewer can see it well enough that focusing it need not move the corridor.
     *
     * That is from half the focus distance out to twice it: nearer, it is at the very edge of the view or passing by;
     * further, it is small with distance.
     *
     * @param distance How far down the corridor the item is.
     * @param focusDistance Where a focused item is brought, from {@link getFocusDistance}.
     */
    export const getIsInView = (distance: number, focusDistance: number) =>
        distance >= focusDistance * HALF && distance <= focusDistance * IN_VIEW_FAR_FACTOR;

    /**
     * Where the corridor has to be for one drawn item to stand at the focus distance.
     *
     * It moves the very copy that took focus, by its own distance, rather than whichever copy of the item is nearest
     * the short way round: going the short way can bring another copy round from behind the viewer, which then becomes
     * the real one, and the element holding focus is put out of reach under the person using it.
     *
     * @param position Where the corridor is, from {@link toPosition}.
     * @param distance How far down the corridor the copy that took focus stands, from {@link getDistance}.
     * @param focusDistance Where it should end up, from {@link getFocusDistance}.
     * @returns The position to glide to, which may lie past either end of the lap.
     */
    export const getGlideTarget = (position: number, distance: number, focusDistance: number) =>
        position + distance - focusDistance;

    /**
     * Remembers a progress the corridor wrote, keeping only the last few.
     *
     * @param recent The writes remembered so far.
     * @param progress The progress just written.
     * @returns The writes to remember, newest last.
     */
    export const rememberWrite = (recent: readonly number[], progress: number) =>
        [...recent, progress].slice(-ECHO_MEMORY);

    /**
     * Whether a progress arriving from outside is only the corridor's own write coming back.
     *
     * A page driving the corridor from a scroll position scrolls to each progress the corridor writes and reads the
     * scroll back a frame or two later, rounded to whole pixels and moved by whatever else nudged the box; reading
     * that as someone else taking over would stop every glide on its first frame. So a progress within a hundredth of
     * a lap of one of the last few writes, the short way round, counts as the corridor's own.
     *
     * @param progress The progress that arrived.
     * @param recent The writes remembered by {@link rememberWrite}.
     */
    export const getIsEcho = (progress: number, recent: readonly number[]) =>
        recent.some((written) => {
            const gap = wrap(progress - written, 1);

            return Math.min(gap, 1 - gap) < ECHO_TOLERANCE;
        });

    /**
     * The CSS that puts one drawn item where its placement says.
     *
     * Every item's box is centered on the corridor's middle before it is moved, so every item turns about and looks
     * from the same point, and the perspective gives the whole corridor one vanishing point. An item whose placement
     * pins its corners is stretched onto them instead, through `QuadWarpUtils.toTransform`, and is hidden when they
     * cannot be drawn. Nearer items stack over further ones.
     *
     * @param placement What the layout answered for the item.
     * @param distance How far down the corridor the item is, which decides its stacking.
     * @returns `width`, `height`, the margins that center it, `transform-origin`, `transform`, `opacity` and
     * `z-index`, as dashed CSS properties. A turned item is moved, then rolled round the corridor's axis, then leaned
     * back, then turned.
     */
    export const toItemStyle = (placement: InfiniteCorridorPlacement, distance: number) => {
        const { size } = placement;

        const box = {
            "width": `${size.width}px`,
            "height": `${size.height}px`,
            "margin-left": `${-size.width * HALF}px`,
            "margin-top": `${-size.height * HALF}px`,
        };

        const layer = `${Math.round(-distance * LAYER_RESOLUTION)}`;

        if ("corners" in placement) {
            const transform =
                placement.corners && QuadWarpUtils.toTransform(size, toItemCorners(placement.corners, size));

            return {
                ...box,
                "transform-origin": CORNER_ORIGIN,
                "transform": transform ?? "none",
                "opacity": transform ? `${MathUtils.clamp01(placement.opacity)}` : HIDDEN,
                "z-index": layer,
            };
        }

        const { offset } = placement;

        return {
            ...box,
            "transform-origin": CENTERED_ORIGIN,
            "transform": `perspective(${placement.perspectivePx}px) translate3d(${offset.x}px, ${offset.y}px, ${offset.z}px) rotateZ(${placement.rollDegrees ?? NO_TURN}deg) rotateX(${placement.tiltDegrees ?? NO_TURN}deg) rotateY(${placement.turnDegrees}deg)`,
            "opacity": `${MathUtils.clamp01(placement.opacity)}`,
            "z-index": layer,
        };
    };
}
