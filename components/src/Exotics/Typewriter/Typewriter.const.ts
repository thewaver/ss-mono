import type { TypewriterMode } from "./Typewriter.types";

import * as styles from "./Typewriter.css";

export const TYPEWRITER_DEFAULTS = {
    animationName: styles.typewriterFade,
    animationDurationMs: 500,
    animationDelayMs: 10,
    initialAnimationDelayMs: 0,
    mode: "type" as TypewriterMode,
};
