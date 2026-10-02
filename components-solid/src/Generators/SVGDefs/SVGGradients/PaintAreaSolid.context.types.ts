import type { Rect } from "@thewaver/ss-utils";

export type PaintAreaContextType = {
    /**
     * The box every gradient built inside is laid across, in the coordinates of the elements it paints, so that
     * several elements sharing one gradient each show their own part of it rather than all of it.
     */
    getPaintArea: () => Rect | undefined;
};
