import { computed, shallowRef } from "vue";

import { MediaQueryMonitorVueUtils } from "@thewaver/ss-components-vue";
import {
    INDEFINITE_REST_DURATION_MS,
    PRIZES,
    SPIN_STYLES,
} from "@thewaver/ss-playground/App/Pages/Wheels/Wheels.const";

import { WheelKnobs } from "../../Knobs/Wheels.const";
import type { WheelSharedProps, WheelSpinStyleKey, WheelsControls } from "./Wheels.types";

export const useWheelsControls = (): WheelsControls => {
    const wedgeCount = shallowRef(WheelKnobs.STARTING_WEDGE_COUNT);
    const spinDuration = shallowRef(WheelKnobs.STARTING_SPIN_DURATION_MS);
    const turns = shallowRef(WheelKnobs.STARTING_TURNS);
    const settleDuration = shallowRef(WheelKnobs.STARTING_SETTLE_DURATION_MS);
    const doesResume = shallowRef(WheelKnobs.STARTING_DOES_RESUME);
    const restDuration = shallowRef(WheelKnobs.STARTING_REST_DURATION_MS);
    const isIdlingAllowed = shallowRef(WheelKnobs.STARTING_IS_IDLING_ALLOWED);
    const idleDelay = shallowRef(WheelKnobs.STARTING_IDLE_DELAY_MS);
    const spinStyle = shallowRef<WheelSpinStyleKey>(WheelKnobs.STARTING_SPIN_STYLE_KEY);
    const isDisabled = shallowRef(WheelKnobs.STARTING_IS_DISABLED);

    const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

    const wedges = computed(() => PRIZES.slice(0, wedgeCount.value));

    const computeSpinDefs = computed(() => {
        const spinStyleKey = spinStyle.value;
        const turnCount = turns.value;

        return (index: number, count: number) => SPIN_STYLES[spinStyleKey](index, count, turnCount);
    });

    const sharedProps = computed<WheelSharedProps>(() => ({
        wedges: wedges.value,
        isDisabled: isDisabled.value,
        spinDurationMs: spinDuration.value,
        settleDurationMs: settleDuration.value,
        restDurationMs: doesResume.value ? restDuration.value : INDEFINITE_REST_DURATION_MS,
        idleDelayMs: isIdlingAllowed.value && !prefersReducedMotion.value ? idleDelay.value : undefined,
        computeSpinDefs: computeSpinDefs.value,
    }));

    return {
        wedgeCount,
        spinDuration,
        turns,
        settleDuration,
        doesResume,
        restDuration,
        isIdlingAllowed,
        idleDelay,
        spinStyle,
        isDisabled,
        wedges,
        sharedProps,
    };
};
