import { useMemo, useState } from "react";

import { MediaQueryMonitorReactUtils } from "@thewaver/ss-components-react";
import {
    INDEFINITE_REST_DURATION_MS,
    PRIZES,
    SPIN_STYLES,
} from "@thewaver/ss-playground/App/Pages/Wheels/Wheels.const";

import { WheelKnobs } from "../../Knobs/Wheels.const";
import type { WheelSpinStyleKey, WheelsControls } from "./Wheels.types";

export const useWheelsControls = (): WheelsControls => {
    const wedgeCountState = useState(WheelKnobs.STARTING_WEDGE_COUNT);
    const spinDurationState = useState(WheelKnobs.STARTING_SPIN_DURATION_MS);
    const turnsState = useState(WheelKnobs.STARTING_TURNS);
    const settleDurationState = useState(WheelKnobs.STARTING_SETTLE_DURATION_MS);
    const doesResumeState = useState(WheelKnobs.STARTING_DOES_RESUME);
    const restDurationState = useState(WheelKnobs.STARTING_REST_DURATION_MS);
    const isIdlingAllowedState = useState(WheelKnobs.STARTING_IS_IDLING_ALLOWED);
    const idleDelayState = useState(WheelKnobs.STARTING_IDLE_DELAY_MS);
    const spinStyleState = useState<WheelSpinStyleKey>(WheelKnobs.STARTING_SPIN_STYLE_KEY);
    const isDisabledState = useState(WheelKnobs.STARTING_IS_DISABLED);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const wedges = useMemo(() => PRIZES.slice(0, wedgeCountState[0]), [wedgeCountState[0]]);

    const spinStyleKey = spinStyleState[0];
    const turns = turnsState[0];

    const computeSpinDefs = useMemo(
        () => (index: number, wedgeCount: number) => SPIN_STYLES[spinStyleKey](index, wedgeCount, turns),
        [spinStyleKey, turns],
    );

    const sharedProps = {
        wedges,
        isDisabled: isDisabledState[0],
        spinDurationMs: spinDurationState[0],
        settleDurationMs: settleDurationState[0],
        restDurationMs: doesResumeState[0] ? restDurationState[0] : INDEFINITE_REST_DURATION_MS,
        idleDelayMs: isIdlingAllowedState[0] && !prefersReducedMotion ? idleDelayState[0] : undefined,
        computeSpinDefs,
    };

    return {
        wedgeCountState,
        spinDurationState,
        turnsState,
        settleDurationState,
        doesResumeState,
        restDurationState,
        isIdlingAllowedState,
        idleDelayState,
        spinStyleState,
        isDisabledState,
        wedges,
        sharedProps,
    };
};
