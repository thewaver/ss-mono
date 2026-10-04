import * as styles from "./ProximityText.css";

export const PROXIMITY_TEXT_DEFAULTS = {
    computeAnimationName: (() => styles.proximityTextSwell) as (
        character: string,
        index: number,
        count: number,
    ) => string,
    reachPx: 120,
};
