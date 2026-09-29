import { type Rect, type Size2d, StoreUtils } from "@thewaver/ss-utils";

import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import type {
    TreemapBox,
    TreemapKeyAction,
    TreemapNode,
    TreemapTile,
    TreemapTransition,
    TreemapZoomClock,
} from "./Treemap.types";

/** Halfway, for splitting a run of tiles into two runs of equal weight. */
const HALF = 0.5;
/** Zero, as a weight, a count or an index. */
const NOTHING = 0;
/** One tile, or one step along a run. */
const SINGLE = 1;
/** How far from the end of a path its parent sits: the last entry is the node itself. */
const PARENT_FROM_END = 2;
/** A zoom that has finished, as a share of its time. */
const SETTLED = 1;
/** Where the easing turns from speeding up to slowing down. */
const EASE_TURN = 0.5;
/** Scales the first half of the easing so it reaches one half at the turn. */
const EASE_IN_SCALE = 4;
/** Scales the second half of the easing, mirrored. */
const EASE_OUT_SCALE = -2;
/** Offsets the second half of the easing, mirrored. */
const EASE_OUT_OFFSET = 2;
/** The easing is cubic. */
const EASE_POWER = 3;
/** How long past its end a zoom is let run before it is settled without waiting for another frame. */
const FRAME_STARVATION_SLACK_MS = 100;

/**
 * Lays out a treemap one level at a time, and answers where one level sits inside another.
 *
 * Every level is tiled as though it filled the whole treemap, whichever level it is. Zooming into a branch
 * therefore shows its children exactly as they were tiled, only larger, and the picture inside a tile before
 * the zoom is the same picture that fills the box after it.
 */
export namespace TreemapUtils {
    /**
     * Works out how much every node in a tree weighs.
     *
     * @param root The whole tree.
     * @returns A leaf's own weight, with a missing or negative one read as nothing, and for a branch the total of
     * its children. A weight set on a branch is ignored.
     */
    export const computeWeights = <T>(root: TreemapNode<T>) => {
        const weights = new Map<TreemapNode<T>, number>();

        const walk = (node: TreemapNode<T>): number => {
            const weight = node.children?.length
                ? node.children.reduce((total, child) => total + walk(child), NOTHING)
                : Math.max(node.weight ?? NOTHING, NOTHING);

            weights.set(node, weight);

            return weight;
        };

        walk(root);

        return weights;
    };

    /**
     * Whether a node has anything to zoom into.
     *
     * @param node The node to ask about.
     * @param weights What {@link computeWeights} answered for the tree the node is in.
     * @returns `true` when at least one child weighs something, since a child weighing nothing gets no tile.
     */
    export const getIsBranch = <T>(node: TreemapNode<T>, weights: Map<TreemapNode<T>, number>) =>
        node.children?.some((child) => (weights.get(child) ?? NOTHING) > NOTHING) ?? false;

    /**
     * Divides a rectangle between a run of weights, each part's area in proportion to its weight.
     *
     * The run is cut in two where the weight on either side comes closest to half, across the rectangle's longer
     * side, and each half is cut again the same way until every part is one weight. Neighbors in the run stay
     * neighbors on screen, and a run sorted heaviest first puts the heaviest in the top left corner.
     *
     * @param weights The weights, in the order to lay them out. None may be negative.
     * @param frame The rectangle to divide.
     * @returns One rectangle per weight, in the same order. They cover the frame exactly, with no gaps between them.
     */
    export const partition = (weights: number[], frame: Rect): Rect[] => {
        const rects: Rect[] = new Array(weights.length);
        const sums = [NOTHING];

        weights.forEach((weight, index) => sums.push(sums[index] + weight));

        const split = (first: number, end: number, total: number, rect: Rect) => {
            if (end - first <= SINGLE) {
                rects[first] = rect;

                return;
            }

            const target = sums[first] + total * HALF;

            let cut = first + SINGLE;
            let last = end - SINGLE;

            while (cut < last) {
                const middle = Math.floor((cut + last) * HALF);

                if (sums[middle] < target) cut = middle + SINGLE;
                else last = middle;
            }

            if (target - sums[cut - SINGLE] < sums[cut] - target && first + SINGLE < cut) cut -= SINGLE;

            const before = sums[cut] - sums[first];
            const share = total > NOTHING ? before / total : SINGLE;

            if (rect.width > rect.height) {
                const width = rect.width * share;

                split(first, cut, before, { ...rect, width });
                split(cut, end, total - before, { ...rect, x: rect.x + width, width: rect.width - width });
            } else {
                const height = rect.height * share;

                split(first, cut, before, { ...rect, height });
                split(cut, end, total - before, { ...rect, y: rect.y + height, height: rect.height - height });
            }
        };

        if (weights.length) split(NOTHING, weights.length, sums[weights.length], frame);

        return rects;
    };

    /**
     * Tiles one branch's children across a box.
     *
     * @param branch The branch whose children are tiled.
     * @param weights What {@link computeWeights} answered for the tree the branch is in.
     * @param size The box to fill, in pixels.
     * @returns A tile per child that weighs something, heaviest first, each placed by {@link partition} from the top
     * left corner of the box.
     */
    export const computeTiles = <T>(
        branch: TreemapNode<T>,
        weights: Map<TreemapNode<T>, number>,
        size: Size2d,
    ): TreemapTile<T>[] => {
        const children = (branch.children ?? [])
            .map((node) => ({ node, weight: weights.get(node) ?? NOTHING }))
            .filter((child) => child.weight > NOTHING)
            .sort((first, second) => second.weight - first.weight);

        const rects = partition(
            children.map((child) => child.weight),
            { x: NOTHING, y: NOTHING, ...size },
        );

        return children.map((child, index) => ({ ...child, rect: rects[index] }));
    };

    /**
     * Moves a rectangle from one frame into another, keeping its place relative to the frame.
     *
     * Projecting a level's tiles from the full box into one of its parent's tiles shrinks them into that tile, and
     * projecting the parent's tiles from that tile out to the full box enlarges them around it.
     *
     * @param rect The rectangle, in the same space as `source`.
     * @param source The frame the rectangle is measured against.
     * @param target The frame to carry it into.
     * @returns The rectangle as it sits in `target`. A `source` with no width or height answers `target` itself.
     */
    export const projectRect = (rect: Rect, source: Rect, target: Rect): Rect => {
        if (source.width <= NOTHING || source.height <= NOTHING) return target;

        const scaleX = target.width / source.width;
        const scaleY = target.height / source.height;

        return {
            x: target.x + (rect.x - source.x) * scaleX,
            y: target.y + (rect.y - source.y) * scaleY,
            width: rect.width * scaleX,
            height: rect.height * scaleY,
        };
    };

    /**
     * The chain of nodes from the root down to a node.
     *
     * @param root The whole tree.
     * @param node The node to find.
     * @returns The root first and `node` last, or `undefined` when `node` is not in the tree. It is what a way back up
     * is drawn from: the root and each branch between it and the one in view.
     */
    export const findPath = <T>(root: TreemapNode<T>, node: TreemapNode<T>): TreemapNode<T>[] | undefined => {
        if (root === node) return [root];

        for (const child of root.children ?? []) {
            const path = findPath(child, node);

            if (path) return [root, ...path];
        }

        return undefined;
    };

    /**
     * Where a node deeper in the tree sits inside the treemap while an outer branch is the one in view.
     *
     * @param path The outer branch first and the node last, with every branch between them, as {@link findPath}
     * lists them.
     * @param weights What {@link computeWeights} answered for the tree.
     * @param size The treemap's box, in pixels.
     * @returns The node's rectangle in pixels — for a child of the outer branch that is its tile, and further down it
     * is the part of that tile the node would take up. `undefined` when a node on the path weighs nothing and so
     * has no tile.
     */
    export const computeDescendantRect = <T>(
        path: TreemapNode<T>[],
        weights: Map<TreemapNode<T>, number>,
        size: Size2d,
    ): Rect | undefined => {
        const full: Rect = { x: NOTHING, y: NOTHING, ...size };

        let frame = full;

        for (let depth = NOTHING; depth < path.length - SINGLE; depth++) {
            const tile = computeTiles(path[depth], weights, size).find(
                (candidate) => candidate.node === path[depth + SINGLE],
            );

            if (!tile) return undefined;

            frame = projectRect(tile.rect, full, frame);
        }

        return frame;
    };

    /**
     * Rounds a rectangle to whole pixels, as the four lengths a positioned element takes.
     *
     * The edges are rounded rather than the size, so two tiles that meet in the layout still meet on screen, with no
     * hairline between them and no pixel where they overlap.
     *
     * @param rect The rectangle, in pixels.
     * @returns `left`, `top`, `width` and `height`, each as a CSS pixel length. The keys are the same in camelCase and
     * kebab-case, so the result is a style in either framework.
     */
    export const toBox = (rect: Rect): TreemapBox => {
        const left = Math.round(rect.x);
        const top = Math.round(rect.y);

        return {
            left: `${left}px`,
            top: `${top}px`,
            width: `${Math.round(rect.x + rect.width) - left}px`,
            height: `${Math.round(rect.y + rect.height) - top}px`,
        };
    };

    /**
     * Which branch a view built on these layouts shows, given the one it was asked for.
     *
     * @param held The branch asked for, by the consumer or by the view itself.
     * @param root The whole tree.
     * @param weights What {@link computeWeights} answered for the tree.
     * @returns `held` while it is a branch of this tree — something with a child that weighs anything — and the root
     * otherwise, so a node left over from an older tree, or a leaf, shows the top level rather than nothing.
     */
    export const resolveBranch = <T>(
        held: TreemapNode<T>,
        root: TreemapNode<T>,
        weights: Map<TreemapNode<T>, number>,
    ) => (getIsBranch(held, weights) && findPath(root, held) ? held : root);

    /**
     * The node a one-stop walk sits on, given the one it would like to.
     *
     * @param candidate The node last moved to, or `undefined` for none yet.
     * @param stops The nodes the walk may land on, in walking order.
     * @returns `candidate` while it is still one of the stops, and the first stop otherwise — `undefined` only when
     * there are no stops at all. It is both the node holding the one tab stop and the one focus goes to after a zoom.
     */
    export const resolveStop = <T>(candidate: T | undefined, stops: T[]) =>
        candidate !== undefined && stops.includes(candidate) ? candidate : stops[NOTHING];

    /**
     * The node one level up from another.
     *
     * @param root The whole tree.
     * @param node The node to go up from.
     * @returns Its parent, or `undefined` for the root and for a node outside the tree. It is where Escape goes.
     */
    export const findParent = <T>(root: TreemapNode<T>, node: TreemapNode<T>) => {
        const path = findPath(root, node);

        return path?.[path.length - PARENT_FROM_END];
    };

    /**
     * What a key does to a walk across a level's branches, which zooms into one on activation.
     *
     * Escape is not answered here, since it goes up a level whichever node holds focus; see {@link findParent}.
     *
     * @param key The key pressed, as `KeyboardEvent.key` names it.
     * @param from The stop that holds focus.
     * @param stops Every stop, in walking order. The arrows walk it both ways without wrapping, and Home and End jump
     * to its ends.
     * @returns `zoom` into `from` for an activation key, `move` to another stop for a step that lands somewhere new,
     * and `undefined` for a key the walk leaves alone, including an arrow that would step past either end.
     */
    export const computeKeyAction = <T>(key: string, from: T, stops: T[]): TreemapKeyAction<T> | undefined => {
        if (NavigatorUtils.getIsActivationKey(key)) return { kind: "zoom", node: from };

        const next = NavigatorUtils.computeNextPosition(key, stops.indexOf(from), stops.length, {
            orientation: "both",
            isLooping: false,
        });

        if (next === undefined || stops[next] === from) return undefined;

        return { kind: "move", node: stops[next] };
    };

    /**
     * What a zoom from one level of a treemap to another has to draw.
     *
     * @param next The branch being zoomed to.
     * @param previous The branch being left.
     * @param weights What {@link computeWeights} answered for the tree.
     * @param size The treemap's box, in pixels.
     * @param durationMs How long the zoom takes.
     * @returns Which way the zoom goes, the old level's tiles, where the inner of the two levels sits inside the outer
     * one, and the duration. `undefined` when there is nothing to animate — no time, no box yet, two branches neither
     * of which holds the other, or a branch on the way that weighs nothing — so the new level simply appears.
     */
    export const computeTransition = <T>(
        next: TreemapNode<T>,
        previous: TreemapNode<T>,
        weights: Map<TreemapNode<T>, number>,
        size: Size2d,
        durationMs: number,
    ): TreemapTransition<T> | undefined => {
        if (durationMs <= NOTHING || size.width <= NOTHING || size.height <= NOTHING) return undefined;

        const inward = findPath(previous, next);
        const path = inward ?? findPath(next, previous);

        if (!path) return undefined;

        const focusRect = computeDescendantRect(path, weights, size);

        if (!focusRect) return undefined;

        return {
            zoom: inward ? "in" : "out",
            leavingTiles: computeTiles(previous, weights, size),
            focusRect,
            durationMs,
        };
    };

    /**
     * Where a tile of the level being zoomed to starts from.
     *
     * @param rect Where the tile settles, in pixels.
     * @param size The treemap's box, in pixels.
     * @param transition What {@link computeTransition} answered for the zoom.
     * @returns Zooming in, the tile shrunk into the branch's old tile; zooming out, the tile blown up around the branch
     * it came out of, so it arrives from beyond the edges.
     */
    export const computeEnteringStart = <T>(rect: Rect, size: Size2d, transition: TreemapTransition<T>) => {
        const full: Rect = { x: NOTHING, y: NOTHING, ...size };

        return transition.zoom === "in"
            ? projectRect(rect, full, transition.focusRect)
            : projectRect(rect, transition.focusRect, full);
    };

    /**
     * Where a tile of the level being left ends up.
     *
     * @param rect Where the tile sat, in pixels.
     * @param size The treemap's box, in pixels.
     * @param transition What {@link computeTransition} answered for the zoom.
     * @returns The reverse of {@link computeEnteringStart}: zooming in, the old level blown up around the branch until
     * that branch fills the box; zooming out, the old level shrunk into the tile it now occupies.
     */
    export const computeLeavingEnd = <T>(rect: Rect, size: Size2d, transition: TreemapTransition<T>) => {
        const full: Rect = { x: NOTHING, y: NOTHING, ...size };

        return transition.zoom === "in"
            ? projectRect(rect, transition.focusRect, full)
            : projectRect(rect, full, transition.focusRect);
    };

    /**
     * The easing every zoom built on these layouts runs through: cubic, slow at both ends and fastest in the middle.
     *
     * @param progress How far through the zoom's time, `0` to `1`.
     * @returns How far through the zoom's movement, `0` to `1`. It is `TREEMAP_ZOOM_EASING` worked out by hand, for
     * a zoom that is drawn frame by frame rather than animated by the browser.
     */
    export const easeZoom = (progress: number) =>
        progress < EASE_TURN
            ? EASE_IN_SCALE * progress ** EASE_POWER
            : SETTLED - (EASE_OUT_SCALE * progress + EASE_OUT_OFFSET) ** EASE_POWER * HALF;

    /**
     * A clock for a zoom drawn frame by frame, reading how far through its time it is.
     *
     * It ticks once per animation frame. A page that stops handing out frames — a background tab, a starved machine —
     * would leave a zoom stuck halfway, so the clock also settles on its own a little after the zoom should have
     * ended, frames or not.
     *
     * @returns A store reading `1` while nothing is running and `0` to `1` while a zoom is, with `start` to run it
     * over a duration from `0`, restarting it if it was already running, and `stop` to cancel its frame and its
     * timer where it stands. Both can be called any number of times, so a view stopped and started again keeps
     * working.
     */
    export const createZoomClock = (): TreemapZoomClock => {
        const progress = StoreUtils.create(SETTLED);

        let frameId: number | undefined;
        let starvationHandle: ReturnType<typeof setTimeout> | undefined;

        const stop = () => {
            if (frameId !== undefined) cancelAnimationFrame(frameId);
            if (starvationHandle !== undefined) clearTimeout(starvationHandle);

            frameId = undefined;
            starvationHandle = undefined;
        };

        const start = (durationMs: number) => {
            stop();

            if (durationMs <= NOTHING) {
                progress.set(SETTLED);

                return;
            }

            const startedAt = performance.now();

            const advance = (now: number) => {
                const reached = Math.min(SETTLED, (now - startedAt) / durationMs);

                progress.set(reached);

                if (reached < SETTLED) frameId = requestAnimationFrame(advance);
                else stop();
            };

            progress.set(NOTHING);
            starvationHandle = setTimeout(() => {
                stop();
                progress.set(SETTLED);
            }, durationMs + FRAME_STARVATION_SLACK_MS);
            frameId = requestAnimationFrame(advance);
        };

        return { get: progress.get, subscribe: progress.subscribe, start, stop };
    };
}
