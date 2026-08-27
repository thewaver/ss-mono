import { For, createMemo, createSignal } from "solid-js";

import { MediaQueryMonitor, PointerTracker } from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import * as styles from "../PointerTrackerPage.css";

const LAMP_COUNT = 12;
const FALLOFF_RADII = 3;
const MIN_LIGHTNESS = 8;
const MAX_LIGHTNESS = 62;
const GLOW_BLUR_PX = 28;
const GLOW_SPREAD_PX = 4;
const GLOW_OPACITY = 0.55;

const Lamp = () => {
    const [getRef, setRef] = createSignal<HTMLElement>();

    const { getReading, getIsPointerPresent } = PointerTracker.create(getRef);

    const getPrefersReducedMotion = MediaQueryMonitor.createReducedMotion();

    const getIntensity = createMemo(() =>
        getIsPointerPresent() ? MathUtils.clamp01(1 - (getReading().edgeRatio - 1) / FALLOFF_RADII) : 0,
    );

    return (
        <div
            ref={setRef}
            class={styles.lamp}
            style={{
                "background-color": `hsl(45, 100%, ${MathUtils.lerp(MIN_LIGHTNESS, MAX_LIGHTNESS, getIntensity())}%)`,
                "box-shadow": getPrefersReducedMotion()
                    ? "none"
                    : `0 0 ${GLOW_BLUR_PX * getIntensity()}px ${GLOW_SPREAD_PX * getIntensity()}px hsl(45 100% 60% / ${GLOW_OPACITY * getIntensity()})`,
            }}
        />
    );
};

export const LampsExample = () => {
    return (
        <div class={styles.lampGrid}>
            <For each={Array.from({ length: LAMP_COUNT }, (_unused, index) => index)}>{() => <Lamp />}</For>
        </div>
    );
};
