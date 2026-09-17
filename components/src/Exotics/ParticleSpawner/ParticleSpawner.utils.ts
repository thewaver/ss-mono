import type { Point2d, Rect } from "@thewaver/ss-utils";

/**
 * The two pieces of a particle's motion that are not the caller's own evaluator: picking a target
 * when none is asked for, measuring where that target actually is, and writing the answer onto the
 * particle's element without going through Solid.
 */
export namespace ParticleSpawnerUtils {
    /**
     * Picks a random target index, used when a spawner is given no `computeTarget` of its own.
     *
     * @param targetCount How many targets are available.
     * @returns An index from `0` up to but excluding `targetCount`, or `undefined` when there are none
     * to pick from.
     */
    export const pickRandomTarget = (targetCount: number): number | undefined =>
        targetCount <= 0 ? undefined : Math.floor(Math.random() * targetCount);

    /**
     * The center of an element's box, relative to another element's box, in pixels.
     *
     * Both boxes are expected in viewport content coordinates — `ElementObserverUtils`'s rect
     * observers, never a raw `getBoundingClientRect` — so the target need not be a descendant of the
     * root, or share any ancestor with it beyond the document itself, and the answer stays correct
     * inside a scaled `Viewport`.
     *
     * @param rect The box being measured.
     * @param rootRect The box positions are being measured relative to.
     * @returns The first box's center, in the second box's own coordinate space.
     */
    export const toRelativeCenter = (rect: Rect, rootRect: Rect): Point2d => ({
        x: rect.x + rect.width * 0.5 - rootRect.x,
        y: rect.y + rect.height * 0.5 - rootRect.y,
    });

    /**
     * Writes a particle's position onto its element, centering the element on the point.
     *
     * Set directly on the style rather than through a signal, because this runs for every live
     * particle on every frame and the reactive round trip is not affordable at that rate.
     *
     * @param el The particle's own element.
     * @param pos Where to center it, relative to the spawner's root.
     */
    export const assignParticlePos = (el: HTMLElement, pos: Point2d) => {
        el.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
    };
}
