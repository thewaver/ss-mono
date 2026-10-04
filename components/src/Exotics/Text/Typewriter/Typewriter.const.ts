import type { TypewriterMode } from "./Typewriter.types";

import * as styles from "./Typewriter.css";

export const TYPEWRITER_DEFAULTS = {
    computeAnimationName: (() => styles.typewriterFade) as (character: string, index: number, count: number) => string,
    animationDurationMs: 500,
    animationDelayMs: 10,
    initialAnimationDelayMs: 0,
    mode: "type" as TypewriterMode,
};
