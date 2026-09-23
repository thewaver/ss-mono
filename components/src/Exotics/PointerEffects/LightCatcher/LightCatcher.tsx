import type { ParentProps } from "solid-js";
import { createMemo, createSignal } from "solid-js";

import { MathUtils } from "@thewaver/ss-utils";

import { PointerTrackerUtils } from "../../../Abstracts/PointerTracker/PointerTracker.utils";
import { SmootherUtils } from "../../../Abstracts/Smoother/Smoother.utils";
import { access } from "../../../Utils/propUtils";
import { LIGHT_CATCHER_DEFAULTS } from "./LightCatcher.const";
import type { LightCatcherProps } from "./LightCatcher.types";

import * as styles from "./LightCatcher.css";

const FULL_STRENGTH = 1;
const NO_STRENGTH = 0;
const UNTOUCHED_LIGHTNESS = 0;
const FULL_LIGHTNESS = 1;

export const LightCatcher = (props: ParentProps<LightCatcherProps>) => {
    const [getRef, setRef] = createSignal<HTMLElement>();

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const { getReading, getIsPointerPresent } = PointerTrackerUtils.create(getRef, getIsDisabled);

    const getIsInRange = createMemo(() => {
        const activeRangePx = access(props.activeRangePx);

        return activeRangePx === undefined || getReading().distance <= activeRangePx;
    });

    const getIsResting = createMemo(() => getIsDisabled() || !getIsPointerPresent() || !getIsInRange());

    const getStrength = createMemo(() => {
        if (getIsResting()) return NO_STRENGTH;

        const rangePx = access(props.lightRangePx) ?? LIGHT_CATCHER_DEFAULTS.lightRangePx;
        const { distance, edgeDistance } = getReading();

        if (distance <= edgeDistance) return FULL_STRENGTH;
        if (rangePx <= edgeDistance) return NO_STRENGTH;

        return MathUtils.clamp01((rangePx - distance) / (rangePx - edgeDistance));
    });

    const getEased = SmootherUtils.create(
        () => [getStrength()],
        () => access(props.smoothingMs) ?? LIGHT_CATCHER_DEFAULTS.smoothingMs,
    );

    const getLitStrength = createMemo(() => {
        const [strength] = getEased();

        return strength;
    });

    const getBrightness = createMemo(() =>
        MathUtils.lerp(
            access(props.restingBrightness) ?? LIGHT_CATCHER_DEFAULTS.restingBrightness,
            access(props.maxBrightness) ?? LIGHT_CATCHER_DEFAULTS.maxBrightness,
            getLitStrength(),
        ),
    );

    const getLightness = createMemo(() =>
        MathUtils.clamp01(
            MathUtils.lerp(
                access(props.restingLightness) ?? LIGHT_CATCHER_DEFAULTS.restingLightness,
                access(props.maxLightness) ?? LIGHT_CATCHER_DEFAULTS.maxLightness,
                getLitStrength(),
            ),
        ),
    );

    const getFilter = createMemo(() => {
        const brightness = `brightness(${getBrightness()})`;
        const lightness = getLightness();

        if (lightness === UNTOUCHED_LIGHTNESS) return brightness;

        return `${brightness} invert(1) brightness(${FULL_LIGHTNESS - lightness}) invert(1)`;
    });

    return (
        <div ref={setRef} class={styles.lightCatcherRoot} style={{ filter: getFilter() }}>
            {props.children}
        </div>
    );
};
