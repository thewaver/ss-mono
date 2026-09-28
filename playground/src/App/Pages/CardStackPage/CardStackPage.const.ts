import type { CardStackMotion } from "@thewaver/ss-components";
import type { SwipeDirection } from "@thewaver/ss-utils";

const MAX_TILT_DEGREES = 20;
const FLUNG_TILT_DEGREES = 40;
const UPRIGHT = 0;

const FLUNG_TILTS: Partial<Record<SwipeDirection, number>> = {
    left: -FLUNG_TILT_DEGREES,
    right: FLUNG_TILT_DEGREES,
};

export const computeCardTilt = (motion: CardStackMotion) => {
    const away = motion.leavingTo ?? motion.returningFrom;

    return away === undefined ? motion.travel.x * MAX_TILT_DEGREES : (FLUNG_TILTS[away] ?? UPRIGHT);
};
