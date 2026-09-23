import type { Rect, Size2d } from "@thewaver/ss-utils";

import type { TreemapNode, TreemapTile } from "./Treemap.types";

/** Halfway, for splitting a run of tiles into two runs of equal weight. */
const HALF = 0.5;
/** Zero, as a weight, a count or an index. */
const NOTHING = 0;
/** One tile, or one step along a run. */
const SINGLE = 1;

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
}
