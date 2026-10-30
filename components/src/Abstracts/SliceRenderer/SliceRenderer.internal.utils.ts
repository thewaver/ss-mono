import type { SliceRendererHandover } from "./SliceRenderer.types";

const DEFAULT_HANDOVER: SliceRendererHandover = "shared";

let handover: SliceRendererHandover = DEFAULT_HANDOVER;

/**
 * How the shared graphics-card renderer hands each component's picture to its canvas, for the Playground to switch
 * while the two ways are compared.
 */
export namespace SliceRendererInternalUtils {
    /**
     * How pictures are handed over right now.
     *
     * `per_element` draws a component's frame the moment it asks and hands the shared canvas's whole picture to it. The
     * shared canvas is the size of the largest frame drawn in this animation frame or the one before, so every
     * component's canvas is that size, transparent past its own corner. `shared` draws every component's frame
     * together once per animation frame and cuts each one's piece out, shown one animation frame late.
     */
    export const getHandover = () => handover;

    /**
     * Switches how pictures are handed over, from each component's next frame on.
     *
     * @param next The way to hand over from now on.
     */
    export const setHandover = (next: SliceRendererHandover) => {
        handover = next;
    };
}
