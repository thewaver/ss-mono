import type { ParentProps } from "solid-js";
import { createMemo, createSignal } from "solid-js";

import { MathUtils } from "@thewaver/ss-utils";

import { PointerTrackerUtils } from "../../../Abstracts/PointerTracker/PointerTracker.utils";
import { access } from "../../../Utils/propUtils";
import type { LightCatcherProps } from "./LightCatcher.types";

import * as styles from "./LightCatcher.css";

const DEFAULT_LIGHT_CATCHER_LIGHT_RANGE_PX = 420;
const DEFAULT_LIGHT_CATCHER_MAX_BRIGHTNESS = 1.6;
const DEFAULT_LIGHT_CATCHER_RESTING_BRIGHTNESS = 1;

const FULL_STRENGTH = 1;
const NO_STRENGTH = 0;

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

        const rangePx = access(props.lightRangePx) ?? DEFAULT_LIGHT_CATCHER_LIGHT_RANGE_PX;
        const { distance, edgeDistance } = getReading();

        if (distance <= edgeDistance) return FULL_STRENGTH;
        if (rangePx <= edgeDistance) return NO_STRENGTH;

        return MathUtils.clamp01((rangePx - distance) / (rangePx - edgeDistance));
    });

    const getBrightness = createMemo(() =>
        MathUtils.lerp(
            access(props.restingBrightness) ?? DEFAULT_LIGHT_CATCHER_RESTING_BRIGHTNESS,
            access(props.maxBrightness) ?? DEFAULT_LIGHT_CATCHER_MAX_BRIGHTNESS,
            getStrength(),
        ),
    );

    return (
        <div ref={setRef} class={styles.lightCatcherRoot} style={{ filter: `brightness(${getBrightness()})` }}>
            {props.children}
        </div>
    );
};
