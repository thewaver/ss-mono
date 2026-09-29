import { createMemo, createSignal } from "solid-js";

import { MediaQueryMonitorSolidUtils } from "@thewaver/ss-components-solid";
import {
    INDEFINITE_REST_DURATION_MS,
    PRIZES,
    SPIN_STYLES,
} from "@thewaver/ss-playground/App/Pages/Wheels/Wheels.const";

import { WheelKnobs } from "../../Knobs/Wheels.const";
import type { WheelSpinStyleKey, WheelsControls } from "./Wheels.types";

export const createWheelsControls = (): WheelsControls => {
    const wedgeCountSignal = createSignal(WheelKnobs.STARTING_WEDGE_COUNT);
    const spinDurationSignal = createSignal(WheelKnobs.STARTING_SPIN_DURATION_MS);
    const turnsSignal = createSignal(WheelKnobs.STARTING_TURNS);
    const settleDurationSignal = createSignal(WheelKnobs.STARTING_SETTLE_DURATION_MS);
    const doesResumeSignal = createSignal(WheelKnobs.STARTING_DOES_RESUME);
    const restDurationSignal = createSignal(WheelKnobs.STARTING_REST_DURATION_MS);
    const isIdlingAllowedSignal = createSignal(WheelKnobs.STARTING_IS_IDLING_ALLOWED);
    const idleDelaySignal = createSignal(WheelKnobs.STARTING_IDLE_DELAY_MS);
    const spinStyleSignal = createSignal<WheelSpinStyleKey>(WheelKnobs.STARTING_SPIN_STYLE_KEY);
    const isDisabledSignal = createSignal(WheelKnobs.STARTING_IS_DISABLED);

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

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
        wedgeCount: wedgeCountSignal,
        spinDuration: spinDurationSignal,
        turns: turnsSignal,
        settleDuration: settleDurationSignal,
        doesResume: doesResumeSignal,
        restDuration: restDurationSignal,
        isIdlingAllowed: isIdlingAllowedSignal,
        idleDelay: idleDelaySignal,
        spinStyle: spinStyleSignal,
        isDisabled: isDisabledSignal,
        getWedges,
        getSharedProps,
    };
};
