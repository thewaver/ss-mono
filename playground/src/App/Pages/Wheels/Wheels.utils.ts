import { createMemo, createSignal } from "solid-js";

import { MediaQueryMonitor } from "@thewaver/ss-components";

import {
    INDEFINITE_REST_DURATION_MS,
    PRIZES,
    SPIN_STYLES,
    STARTING_IDLE_DELAY_MS,
    STARTING_REST_DURATION_MS,
    STARTING_SETTLE_DURATION_MS,
    STARTING_SPIN_DURATION_MS,
    STARTING_SPIN_STYLE_KEY,
    STARTING_TURNS,
    STARTING_WEDGE_COUNT,
} from "./Wheels.const";
import type { WheelSpinStyleKey, WheelsControls } from "./Wheels.types";

export const createWheelsControls = (): WheelsControls => {
    const wedgeCountSignal = createSignal(STARTING_WEDGE_COUNT);
    const spinDurationSignal = createSignal(STARTING_SPIN_DURATION_MS);
    const turnsSignal = createSignal(STARTING_TURNS);
    const settleDurationSignal = createSignal(STARTING_SETTLE_DURATION_MS);
    const doesResumeSignal = createSignal(true);
    const restDurationSignal = createSignal(STARTING_REST_DURATION_MS);
    const isIdlingAllowedSignal = createSignal(true);
    const idleDelaySignal = createSignal(STARTING_IDLE_DELAY_MS);
    const spinStyleSignal = createSignal<WheelSpinStyleKey>(STARTING_SPIN_STYLE_KEY);
    const isDisabledSignal = createSignal(false);

    const getPrefersReducedMotion = MediaQueryMonitor.createReducedMotion();

    const getWedges = createMemo(() => PRIZES.slice(0, wedgeCountSignal[0]()));

    const getSharedProps = createMemo(() => ({
        wedges: getWedges,
        isDisabled: isDisabledSignal[0],
        spinDurationMs: spinDurationSignal[0],
        settleDurationMs: settleDurationSignal[0],
        restDurationMs: () => (doesResumeSignal[0]() ? restDurationSignal[0]() : INDEFINITE_REST_DURATION_MS),
        idleDelayMs: () =>
            isIdlingAllowedSignal[0]() && !getPrefersReducedMotion() ? idleDelaySignal[0]() : undefined,
        computeSpinDefs: (index: number, wedgeCount: number) =>
            SPIN_STYLES[spinStyleSignal[0]()](index, wedgeCount, turnsSignal[0]()),
    }));

    return {
        wedgeCountSignal,
        spinDurationSignal,
        turnsSignal,
        settleDurationSignal,
        doesResumeSignal,
        restDurationSignal,
        isIdlingAllowedSignal,
        idleDelaySignal,
        spinStyleSignal,
        isDisabledSignal,
        getWedges,
        getSharedProps,
    };
};
