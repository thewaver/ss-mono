import type { ScanlineAnimationOrientation } from "./ScanlineAnimation.types";

export const SCANLINE_ANIMATION_DEFAULTS = {
    orientation: "horizontal" as ScanlineAnimationOrientation,
};

export const SCANLINE_ANIMATION_ORIENTATIONS: readonly ScanlineAnimationOrientation[] = ["horizontal", "vertical"];
