import { MediaQueryMonitorSvelteUtils } from "@thewaver/ss-components-svelte";
import {
    INDEFINITE_REST_DURATION_MS,
    PRIZES,
    SPIN_STYLES,
} from "@thewaver/ss-playground/App/Pages/Wheels/Wheels.const";

import { WheelKnobs } from "../../Knobs/Wheels.const";
import type { WheelSpinStyleKey, WheelsControls } from "./Wheels.types";

export const createWheelsControls = (): WheelsControls => {
    let wedgeCount = $state(WheelKnobs.STARTING_WEDGE_COUNT);
    let spinDuration = $state(WheelKnobs.STARTING_SPIN_DURATION_MS);
    let turns = $state(WheelKnobs.STARTING_TURNS);
    let settleDuration = $state(WheelKnobs.STARTING_SETTLE_DURATION_MS);
    let doesResume = $state(WheelKnobs.STARTING_DOES_RESUME);
    let restDuration = $state(WheelKnobs.STARTING_REST_DURATION_MS);
    let isIdlingAllowed = $state(WheelKnobs.STARTING_IS_IDLING_ALLOWED);
    let idleDelay = $state(WheelKnobs.STARTING_IDLE_DELAY_MS);
    let spinStyle = $state<WheelSpinStyleKey>(WheelKnobs.STARTING_SPIN_STYLE_KEY);
    let isDisabled = $state(WheelKnobs.STARTING_IS_DISABLED);

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const wedges = $derived(PRIZES.slice(0, wedgeCount));

    const computeSpinDefs = (index: number, count: number) => SPIN_STYLES[spinStyle](index, count, turns);

    const sharedProps = $derived({
        wedges,
        isDisabled,
        spinDurationMs: spinDuration,
        settleDurationMs: settleDuration,
        restDurationMs: doesResume ? restDuration : INDEFINITE_REST_DURATION_MS,
        idleDelayMs: isIdlingAllowed && !getPrefersReducedMotion() ? idleDelay : undefined,
        computeSpinDefs,
    });

    return {
        get wedgeCount() {
            return wedgeCount;
        },
        set wedgeCount(value) {
            wedgeCount = value;
        },
        get spinDuration() {
            return spinDuration;
        },
        set spinDuration(value) {
            spinDuration = value;
        },
        get turns() {
            return turns;
        },
        set turns(value) {
            turns = value;
        },
        get settleDuration() {
            return settleDuration;
        },
        set settleDuration(value) {
            settleDuration = value;
        },
        get doesResume() {
            return doesResume;
        },
        set doesResume(value) {
            doesResume = value;
        },
        get restDuration() {
            return restDuration;
        },
        set restDuration(value) {
            restDuration = value;
        },
        get isIdlingAllowed() {
            return isIdlingAllowed;
        },
        set isIdlingAllowed(value) {
            isIdlingAllowed = value;
        },
        get idleDelay() {
            return idleDelay;
        },
        set idleDelay(value) {
            idleDelay = value;
        },
        get spinStyle() {
            return spinStyle;
        },
        set spinStyle(value) {
            spinStyle = value;
        },
        get isDisabled() {
            return isDisabled;
        },
        set isDisabled(value) {
            isDisabled = value;
        },
        get wedges() {
            return wedges;
        },
        get sharedProps() {
            return sharedProps;
        },
    };
};
