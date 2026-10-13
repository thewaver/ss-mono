import type { ReactNode } from "react";

import type { BaseWraparoundProps } from "@thewaver/ss-components";

export type WraparoundProps = BaseWraparoundProps & {
    /**
     * Whether the content is drifting. It starts `true`, so a window given a speed drifts at once; writing `false`
     * stops it where it is and `true` carries on from there. The pointer and focus pause it only while they last;
     * this is what stops it for good.
     */
    playback?: readonly [boolean, (value: boolean) => void];
    /**
     * Draws the arrangement to repeat — a `Mosaic`, a `Formation`, a plain grid. It is called once for the original
     * and once for every copy, so the content must have a size of its own: the window does not give it one, and its
     * size is the distance at which it repeats. A gap the arrangement leaves at its edges shows at every join.
     *
     * Only the original is real to a screen reader and to Tab; the copies are inert. Anything with a state of its
     * own — a playing video, a half-filled field, an open popup — runs separately in each copy, so a copy shows
     * whatever it was drawn with rather than what the original is doing. The original moves to whichever tile the
     * pointer is over, so hovering and clicking always reach it.
     */
    renderContent: () => ReactNode;
};
