import { type Circle, CircleUtils } from "@thewaver/ss-utils";

import { TreemapUtils } from "../Treemap/Treemap.utils";
import type { CirclePackingNode } from "./CirclePacking.types";

/** Zero, as a weight, a length or an index. */
const NOTHING = 0;
/** One, as a count or a whole. */
const SINGLE = 1;
/** Double, for the two sides of a diameter. */
const DOUBLE = 2;
/** The first-pass padding, as a share of the final one. */
const FIRST_PASS_PADDING = 0.5;

type Work<T> = Circle & { node: CirclePackingNode<T>; children: Work<T>[] };

/**
 * Packs a tree as nested circles, and moves a view smoothly from one circle to another.
 *
 * The packing is the one D3's `pack` produces: a leaf's area is its weight, siblings are laid against each other as
 * tightly as they will go, and a branch is the smallest circle around its children plus the padding — the
 * packing itself is `CircleUtils.pack`, and the zoom between two circles is `CircleUtils.interpolateZoom`.
 */
export namespace CirclePackingUtils {
    /**
     * Packs a whole tree into a square.
     *
     * @param root The whole tree.
     * @param weights How much every node weighs — a leaf its own weight, a branch the total of its children.
     * @param side The width of the square, in pixels.
     * @param padding The space left between neighboring circles and inside each branch, in pixels.
     * @returns A circle per node that weighs something, with the root filling the square and centered on the origin.
     */
    export const computeLayout = <T>(
        root: CirclePackingNode<T>,
        weights: Map<CirclePackingNode<T>, number>,
        side: number,
        padding: number,
    ) => {
        const build = (node: CirclePackingNode<T>): Work<T> => ({
            node,
            x: NOTHING,
            y: NOTHING,
            radius: Math.sqrt(weights.get(node) ?? NOTHING),
            children: (node.children ?? [])
                .filter((child) => (weights.get(child) ?? NOTHING) > NOTHING)
                .sort((first, second) => (weights.get(second) ?? NOTHING) - (weights.get(first) ?? NOTHING))
                .map(build),
        });

        const packChildren = (work: Work<T>, gap: number) => {
            work.children.forEach((child) => packChildren(child, gap));

            if (!work.children.length) return;

            const packed = CircleUtils.pack(work.children.map((child) => child.radius + gap));

            work.children.forEach((child, index) => {
                child.x = packed.circles[index].x;
                child.y = packed.circles[index].y;
            });
            work.radius = packed.radius + gap;
        };

        const translate = (work: Work<T>, scale: number, parent?: Work<T>) => {
            work.radius *= scale;

            if (parent) {
                work.x = parent.x + scale * work.x;
                work.y = parent.y + scale * work.y;
            }

            work.children.forEach((child) => translate(child, scale, work));
        };

        const top = build(root);

        packChildren(top, padding * FIRST_PASS_PADDING);
        translate(top, SINGLE);

        const firstRadius = top.radius;

        packChildren(top, side > NOTHING && firstRadius > NOTHING ? padding * (firstRadius / side) : NOTHING);
        translate(top, top.radius > NOTHING ? side / (DOUBLE * top.radius) : NOTHING);

        const layout = new Map<CirclePackingNode<T>, Circle>();

        const collect = (work: Work<T>) => {
            layout.set(work.node, { x: work.x, y: work.y, radius: work.radius });
            work.children.forEach(collect);
        };

        collect(top);

        return layout;
    };

    /**
     * Where a circle is drawn while a view is showing.
     *
     * @param circle The circle, as {@link computeLayout} placed it.
     * @param view What is in view: the circle that has to fit across the drawing.
     * @param side The width of the drawing, in pixels.
     * @returns The circle relative to the drawing's center, scaled so the view's circle fills the drawing.
     */
    export const project = (circle: Circle, view: Circle, side: number): Circle => {
        const scale = view.radius > NOTHING ? side / (view.radius * DOUBLE) : NOTHING;

        return {
            x: (circle.x - view.x) * scale,
            y: (circle.y - view.y) * scale,
            radius: circle.radius * scale,
        };
    };

    /**
     * Every node that gets a circle, in drawing order.
     *
     * @param root The whole tree.
     * @param layout What {@link computeLayout} answered for it.
     * @returns Every node the layout placed but the root, level by level from the outside in, so a circle is always
     * drawn after the one around it and on top of it.
     */
    export const listNodes = <T>(root: CirclePackingNode<T>, layout: Map<CirclePackingNode<T>, Circle>) => {
        const nodes: CirclePackingNode<T>[] = [];
        const queue = [root];

        while (queue.length) {
            const node = queue.shift()!;

            if (node !== root) nodes.push(node);

            queue.push(...(node.children ?? []).filter((child) => layout.has(child)));
        }

        return nodes;
    };

    /**
     * How deep every node in a tree is.
     *
     * @param root The whole tree.
     * @returns The root at `0`, its children at `1`, and so on down.
     */
    export const computeDepths = <T>(root: CirclePackingNode<T>) => {
        const depths = new Map<CirclePackingNode<T>, number>();

        const walk = (node: CirclePackingNode<T>, depth: number) => {
            depths.set(node, depth);
            node.children?.forEach((child) => walk(child, depth + SINGLE));
        };

        walk(root, NOTHING);

        return depths;
    };

    /**
     * What is in view at one moment of a zoom.
     *
     * @param path What `CircleUtils.interpolateZoom` answered for the zoom, or `undefined` before any zoom has run.
     * @param target The view the zoom is headed for.
     * @param progress How far through the zoom's time, `0` to `1`, as `TreemapUtils.createZoomClock` reads it.
     * @returns `target` once the zoom is over or when there is no path, and the point along the path eased by
     * `TreemapUtils.easeZoom` while it runs. A new zoom started mid-way begins from this, so it never jumps.
     */
    export const computeShownView = (
        path: ((progress: number) => Circle) | undefined,
        target: Circle,
        progress: number,
    ) => (progress < SINGLE && path ? path(TreemapUtils.easeZoom(progress)) : target);
}
