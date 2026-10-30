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
     * Either way, every component's frame is drawn together once per animation frame and shown one animation frame
     * late. `per_element` hands each frame over the moment it is drawn, as the shared canvas's whole picture; the shared
     * canvas is the size of the largest frame asked for in this animation frame or the one before, so every
     * component's canvas is that size, transparent past its own corner. `shared` hands one picture holding every frame
     * over and cuts each one's piece out.
     */
    export const getHandover = () => handover;

    /**
     * Switches how pictures are handed over, from each component's next frame on; a frame asked for before the switch
     * is still handed over the way it was asked for.
     *
     * @param next The way to hand over from now on.
     */
    export const setHandover = (next: SliceRendererHandover) => {
        handover = next;
    };
}
