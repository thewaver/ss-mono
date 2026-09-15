import type { SampleCheckKnob, SampleNumberKnob } from "../../Samples.types";

const CIRCULAR_KNOB: SampleCheckKnob = { kind: "check", label: "Circular" };
const CYCLES_KNOB: SampleCheckKnob = { kind: "check", label: "Cycle color" };
const GLOW_SCALE_KNOB: SampleNumberKnob = {
    kind: "number",
    label: "Glow scale",
    min: 0.2,
    max: 3,
    step: 0.1,
};
const TRAIL_ALPHA_KNOB: SampleNumberKnob = { kind: "number", label: "Trail alpha", min: 0.05, max: 1, step: 0.05 };
const TRAIL_DECAY_KNOB: SampleNumberKnob = {
    kind: "number",
    label: "Trail decay (exponent)",
    min: 0.5,
    max: 5,
    step: 0.1,
};

const CORE_STOP_KNOB: SampleNumberKnob = { kind: "number", label: "Core stop (%)", min: 1, max: 80, step: 1 };
const CORE_ALPHA_KNOB: SampleNumberKnob = { kind: "number", label: "Core alpha", min: 0.05, max: 1, step: 0.05 };
const PEAK_ALPHA_KNOB: SampleNumberKnob = { kind: "number", label: "Peak alpha", min: 0.05, max: 1, step: 0.05 };
const FALLOFF_STOP_KNOB: SampleNumberKnob = { kind: "number", label: "Falloff stop (%)", min: 5, max: 100, step: 1 };
const FALLOFF_ALPHA_KNOB: SampleNumberKnob = { kind: "number", label: "Falloff alpha", min: 0, max: 1, step: 0.05 };
const AGE_COLOR_SPAN_KNOB: SampleNumberKnob = {
    kind: "number",
    label: "Age color span",
    min: 0.1,
    max: 1,
    step: 0.05,
};
const CYCLE_MS_KNOB: SampleNumberKnob = { kind: "number", label: "Cycle (ms)", min: 200, max: 4000, step: 100 };
const FALLOFF_SPREAD_KNOB: SampleNumberKnob = { kind: "number", label: "Falloff spread (%)", min: 1, max: 50, step: 1 };
const BAND_TRAVEL_KNOB: SampleNumberKnob = {
    kind: "number",
    label: "Band travel",
    min: 0,
    max: 3,
    step: 0.1,
};
const BAND_ANGLE_KNOB: SampleNumberKnob = { kind: "number", label: "Band angle (°)", min: -180, max: 180, step: 5 };
const GHOST_SATURATION_KNOB: SampleNumberKnob = {
    kind: "number",
    label: "Ghost saturation",
    min: 0,
    max: 2,
    step: 0.05,
};
const GHOST_LUMINOSITY_KNOB: SampleNumberKnob = {
    kind: "number",
    label: "Ghost luminosity",
    min: 0.5,
    max: 2,
    step: 0.05,
};
const GHOST_NEAR_GROWTH_KNOB: SampleNumberKnob = {
    kind: "number",
    label: "Ghost near growth",
    min: 0.2,
    max: 2,
    step: 0.05,
};
const GHOST_FAR_GROWTH_KNOB: SampleNumberKnob = {
    kind: "number",
    label: "Ghost far growth",
    min: 0.2,
    max: 2,
    step: 0.05,
};
const SOURCE_SCALE_KNOB: SampleNumberKnob = { kind: "number", label: "Source scale", min: 0.1, max: 2, step: 0.05 };
const SOURCE_STOP_KNOB: SampleNumberKnob = { kind: "number", label: "Source stop (%)", min: 1, max: 100, step: 1 };
const SOURCE_ALPHA_KNOB: SampleNumberKnob = { kind: "number", label: "Source alpha", min: 0, max: 1, step: 0.05 };
const RIPPLE_COUNT_KNOB: SampleNumberKnob = { kind: "number", label: "Ripple count", min: 1, max: 16, step: 1 };
const RIPPLE_SPACING_KNOB: SampleNumberKnob = {
    kind: "number",
    label: "Ripple spacing ratio",
    min: 0.02,
    max: 0.5,
    step: 0.01,
};
const RIPPLE_START_SCALE_KNOB: SampleNumberKnob = {
    kind: "number",
    label: "Ripple start scale",
    min: 0.05,
    max: 2,
    step: 0.05,
};
const RIPPLE_END_SCALE_KNOB: SampleNumberKnob = {
    kind: "number",
    label: "Ripple end scale",
    min: 0.1,
    max: 3,
    step: 0.05,
};
const RIPPLE_ALPHA_KNOB: SampleNumberKnob = { kind: "number", label: "Ripple alpha", min: 0.05, max: 1, step: 0.05 };
const RIPPLE_DECAY_KNOB: SampleNumberKnob = {
    kind: "number",
    label: "Ripple decay (exponent)",
    min: 0.5,
    max: 5,
    step: 0.1,
};
const CREST_STOP_KNOB: SampleNumberKnob = { kind: "number", label: "Crest stop (%)", min: 10, max: 100, step: 1 };
const CREST_SPREAD_START_KNOB: SampleNumberKnob = {
    kind: "number",
    label: "Crest spread start (%)",
    min: 1,
    max: 50,
    step: 1,
};
const CREST_SPREAD_END_KNOB: SampleNumberKnob = {
    kind: "number",
    label: "Crest spread end (%)",
    min: 1,
    max: 50,
    step: 1,
};
const SWEEP_ARC_KNOB: SampleNumberKnob = { kind: "number", label: "Sweep arc (°)", min: 5, max: 180, step: 5 };
const SMEAR_MAX_KNOB: SampleNumberKnob = { kind: "number", label: "Smear max", min: 1, max: 8, step: 0.5 };
const SMEAR_SMOOTHING_KNOB: SampleNumberKnob = {
    kind: "number",
    label: "Smear smoothing",
    min: 0.05,
    max: 1,
    step: 0.05,
};
const SMEAR_FULL_STEP_KNOB: SampleNumberKnob = {
    kind: "number",
    label: "Smear full step ratio",
    min: 0.005,
    max: 0.2,
    step: 0.005,
};

export namespace TrackedGradientKnobs {
    export const KNOBS_BY_FAMILY = {
        band_1: {
            coreStop: CORE_STOP_KNOB,
            coreAlpha: CORE_ALPHA_KNOB,
            falloffSpread: FALLOFF_SPREAD_KNOB,
            falloffAlpha: FALLOFF_ALPHA_KNOB,
            bandTravel: BAND_TRAVEL_KNOB,
        },
        band_1v1: {
            coreStop: CORE_STOP_KNOB,
            coreAlpha: CORE_ALPHA_KNOB,
            falloffSpread: FALLOFF_SPREAD_KNOB,
            falloffAlpha: FALLOFF_ALPHA_KNOB,
            bandTravel: BAND_TRAVEL_KNOB,
        },
        band_diag_1: {
            coreStop: CORE_STOP_KNOB,
            coreAlpha: CORE_ALPHA_KNOB,
            falloffSpread: FALLOFF_SPREAD_KNOB,
            falloffAlpha: FALLOFF_ALPHA_KNOB,
            bandTravel: BAND_TRAVEL_KNOB,
            bandAngle: BAND_ANGLE_KNOB,
        },
        hand_1: { sweepArc: SWEEP_ARC_KNOB, peakAlpha: PEAK_ALPHA_KNOB },
        hand_trail_1: {
            trailAlpha: TRAIL_ALPHA_KNOB,
            trailDecay: TRAIL_DECAY_KNOB,
            sweepArc: SWEEP_ARC_KNOB,
        },
        hand_trail_2: {
            cycles: CYCLES_KNOB,
            cycleMs: CYCLE_MS_KNOB,
            trailAlpha: TRAIL_ALPHA_KNOB,
            trailDecay: TRAIL_DECAY_KNOB,
            sweepArc: SWEEP_ARC_KNOB,
            ageColorSpan: AGE_COLOR_SPAN_KNOB,
        },
        hand_trail_3: {
            cycles: CYCLES_KNOB,
            cycleMs: CYCLE_MS_KNOB,
            trailAlpha: TRAIL_ALPHA_KNOB,
            trailDecay: TRAIL_DECAY_KNOB,
            sweepArc: SWEEP_ARC_KNOB,
            ageColorSpan: AGE_COLOR_SPAN_KNOB,
        },
        spot_1: {
            circular: CIRCULAR_KNOB,
            glowScale: GLOW_SCALE_KNOB,
            coreStop: CORE_STOP_KNOB,
            coreAlpha: CORE_ALPHA_KNOB,
            falloffStop: FALLOFF_STOP_KNOB,
            falloffAlpha: FALLOFF_ALPHA_KNOB,
        },
        spot_flare_2: {
            circular: CIRCULAR_KNOB,
            glowScale: GLOW_SCALE_KNOB,
            coreStop: CORE_STOP_KNOB,
            coreAlpha: CORE_ALPHA_KNOB,
            falloffStop: FALLOFF_STOP_KNOB,
            falloffAlpha: FALLOFF_ALPHA_KNOB,
            ghostSaturation: GHOST_SATURATION_KNOB,
            ghostLuminosity: GHOST_LUMINOSITY_KNOB,
            ghostNearGrowth: GHOST_NEAR_GROWTH_KNOB,
            ghostFarGrowth: GHOST_FAR_GROWTH_KNOB,
        },
        spot_flare_3: {
            circular: CIRCULAR_KNOB,
            glowScale: GLOW_SCALE_KNOB,
            coreStop: CORE_STOP_KNOB,
            coreAlpha: CORE_ALPHA_KNOB,
            falloffStop: FALLOFF_STOP_KNOB,
            falloffAlpha: FALLOFF_ALPHA_KNOB,
            ghostSaturation: GHOST_SATURATION_KNOB,
            ghostLuminosity: GHOST_LUMINOSITY_KNOB,
            ghostNearGrowth: GHOST_NEAR_GROWTH_KNOB,
            ghostFarGrowth: GHOST_FAR_GROWTH_KNOB,
        },
        spot_ripple_1: {
            circular: CIRCULAR_KNOB,
            sourceScale: SOURCE_SCALE_KNOB,
            sourceStop: SOURCE_STOP_KNOB,
            sourceAlpha: SOURCE_ALPHA_KNOB,
            rippleCount: RIPPLE_COUNT_KNOB,
            rippleSpacingRatio: RIPPLE_SPACING_KNOB,
            rippleStartScale: RIPPLE_START_SCALE_KNOB,
            rippleEndScale: RIPPLE_END_SCALE_KNOB,
            rippleAlpha: RIPPLE_ALPHA_KNOB,
            rippleDecay: RIPPLE_DECAY_KNOB,
            crestStop: CREST_STOP_KNOB,
            crestSpreadStart: CREST_SPREAD_START_KNOB,
            crestSpreadEnd: CREST_SPREAD_END_KNOB,
        },
        spot_ripple_2: {
            circular: CIRCULAR_KNOB,
            cycles: CYCLES_KNOB,
            cycleMs: CYCLE_MS_KNOB,
            sourceScale: SOURCE_SCALE_KNOB,
            sourceStop: SOURCE_STOP_KNOB,
            sourceAlpha: SOURCE_ALPHA_KNOB,
            rippleCount: RIPPLE_COUNT_KNOB,
            rippleSpacingRatio: RIPPLE_SPACING_KNOB,
            rippleStartScale: RIPPLE_START_SCALE_KNOB,
            rippleEndScale: RIPPLE_END_SCALE_KNOB,
            rippleAlpha: RIPPLE_ALPHA_KNOB,
            rippleDecay: RIPPLE_DECAY_KNOB,
            crestStop: CREST_STOP_KNOB,
            crestSpreadStart: CREST_SPREAD_START_KNOB,
            crestSpreadEnd: CREST_SPREAD_END_KNOB,
        },
        spot_ripple_3: {
            circular: CIRCULAR_KNOB,
            cycles: CYCLES_KNOB,
            cycleMs: CYCLE_MS_KNOB,
            sourceScale: SOURCE_SCALE_KNOB,
            sourceStop: SOURCE_STOP_KNOB,
            sourceAlpha: SOURCE_ALPHA_KNOB,
            rippleCount: RIPPLE_COUNT_KNOB,
            rippleSpacingRatio: RIPPLE_SPACING_KNOB,
            rippleStartScale: RIPPLE_START_SCALE_KNOB,
            rippleEndScale: RIPPLE_END_SCALE_KNOB,
            rippleAlpha: RIPPLE_ALPHA_KNOB,
            rippleDecay: RIPPLE_DECAY_KNOB,
            crestStop: CREST_STOP_KNOB,
            crestSpreadStart: CREST_SPREAD_START_KNOB,
            crestSpreadEnd: CREST_SPREAD_END_KNOB,
        },
        spot_smear_1: {
            circular: CIRCULAR_KNOB,
            glowScale: GLOW_SCALE_KNOB,
            trailAlpha: TRAIL_ALPHA_KNOB,
            trailDecay: TRAIL_DECAY_KNOB,
            coreStop: CORE_STOP_KNOB,
            coreAlpha: CORE_ALPHA_KNOB,
            falloffStop: FALLOFF_STOP_KNOB,
            falloffAlpha: FALLOFF_ALPHA_KNOB,
            smearMax: SMEAR_MAX_KNOB,
            smearSmoothing: SMEAR_SMOOTHING_KNOB,
            smearFullStepRatio: SMEAR_FULL_STEP_KNOB,
        },
        spot_smear_2: {
            circular: CIRCULAR_KNOB,
            cycles: CYCLES_KNOB,
            cycleMs: CYCLE_MS_KNOB,
            glowScale: GLOW_SCALE_KNOB,
            trailAlpha: TRAIL_ALPHA_KNOB,
            trailDecay: TRAIL_DECAY_KNOB,
            coreStop: CORE_STOP_KNOB,
            coreAlpha: CORE_ALPHA_KNOB,
            falloffStop: FALLOFF_STOP_KNOB,
            falloffAlpha: FALLOFF_ALPHA_KNOB,
            ageColorSpan: AGE_COLOR_SPAN_KNOB,
            smearMax: SMEAR_MAX_KNOB,
            smearSmoothing: SMEAR_SMOOTHING_KNOB,
            smearFullStepRatio: SMEAR_FULL_STEP_KNOB,
        },
        spot_smear_3: {
            circular: CIRCULAR_KNOB,
            cycles: CYCLES_KNOB,
            cycleMs: CYCLE_MS_KNOB,
            glowScale: GLOW_SCALE_KNOB,
            trailAlpha: TRAIL_ALPHA_KNOB,
            trailDecay: TRAIL_DECAY_KNOB,
            coreStop: CORE_STOP_KNOB,
            coreAlpha: CORE_ALPHA_KNOB,
            falloffStop: FALLOFF_STOP_KNOB,
            falloffAlpha: FALLOFF_ALPHA_KNOB,
            ageColorSpan: AGE_COLOR_SPAN_KNOB,
            smearMax: SMEAR_MAX_KNOB,
            smearSmoothing: SMEAR_SMOOTHING_KNOB,
            smearFullStepRatio: SMEAR_FULL_STEP_KNOB,
        },
        spot_trail_1: {
            circular: CIRCULAR_KNOB,
            glowScale: GLOW_SCALE_KNOB,
            trailAlpha: TRAIL_ALPHA_KNOB,
            trailDecay: TRAIL_DECAY_KNOB,
            coreStop: CORE_STOP_KNOB,
            coreAlpha: CORE_ALPHA_KNOB,
            falloffStop: FALLOFF_STOP_KNOB,
            falloffAlpha: FALLOFF_ALPHA_KNOB,
        },
        spot_trail_2: {
            circular: CIRCULAR_KNOB,
            cycles: CYCLES_KNOB,
            cycleMs: CYCLE_MS_KNOB,
            glowScale: GLOW_SCALE_KNOB,
            trailAlpha: TRAIL_ALPHA_KNOB,
            trailDecay: TRAIL_DECAY_KNOB,
            coreStop: CORE_STOP_KNOB,
            coreAlpha: CORE_ALPHA_KNOB,
            falloffStop: FALLOFF_STOP_KNOB,
            falloffAlpha: FALLOFF_ALPHA_KNOB,
            ageColorSpan: AGE_COLOR_SPAN_KNOB,
        },
        spot_trail_3: {
            circular: CIRCULAR_KNOB,
            cycles: CYCLES_KNOB,
            cycleMs: CYCLE_MS_KNOB,
            glowScale: GLOW_SCALE_KNOB,
            trailAlpha: TRAIL_ALPHA_KNOB,
            trailDecay: TRAIL_DECAY_KNOB,
            coreStop: CORE_STOP_KNOB,
            coreAlpha: CORE_ALPHA_KNOB,
            falloffStop: FALLOFF_STOP_KNOB,
            falloffAlpha: FALLOFF_ALPHA_KNOB,
            ageColorSpan: AGE_COLOR_SPAN_KNOB,
        },
    };

    const RIPPLE_SOURCE_SCALE = 0.25;

    export const BAND_DEFAULTS = {
        coreStop: 50,
        coreAlpha: 0.75,
        falloffSpread: 25,
        falloffAlpha: 0.25,
        bandTravel: 1,
    };
    export const BAND_BLEND_DEFAULTS = { ...BAND_DEFAULTS, coreAlpha: 0.5, falloffAlpha: 0.15 };
    export const BAND_DIAGONAL_DEFAULTS = { ...BAND_DEFAULTS, bandTravel: 1.25, bandAngle: 45 };

    export const HAND_DEFAULTS = { sweepArc: 90, peakAlpha: 1 };
    export const HAND_TRAIL_DEFAULTS = { trailAlpha: 0.25, trailDecay: 2.2, sweepArc: 90 };
    export const HAND_TRAIL_CYCLING_DEFAULTS = { ...HAND_TRAIL_DEFAULTS, ageColorSpan: 0.5, cycleMs: 1000 };

    export const SPOT_DEFAULTS = { glowScale: 1.5, coreStop: 5, coreAlpha: 0.75, falloffStop: 40, falloffAlpha: 0.25 };
    export const SPOT_FLARE_DEFAULTS = {
        ...SPOT_DEFAULTS,
        ghostSaturation: 0.5,
        ghostLuminosity: 1.25,
        ghostNearGrowth: 1,
        ghostFarGrowth: 0.5,
    };

    export const SPOT_RIPPLE_DEFAULTS = {
        sourceScale: RIPPLE_SOURCE_SCALE,
        sourceStop: 25,
        sourceAlpha: 0.5,
        rippleCount: 8,
        rippleSpacingRatio: 0.15,
        rippleStartScale: RIPPLE_SOURCE_SCALE,
        rippleEndScale: 0.85,
        rippleAlpha: 0.5,
        rippleDecay: 1.8,
        crestStop: 80,
        crestSpreadStart: 20,
        crestSpreadEnd: 4,
    };
    export const SPOT_RIPPLE_CYCLING_DEFAULTS = { ...SPOT_RIPPLE_DEFAULTS, cycleMs: 1000 };

    export const SPOT_TRAIL_DEFAULTS = {
        glowScale: 0.8,
        trailAlpha: 0.25,
        trailDecay: 2.2,
        coreStop: 5,
        coreAlpha: 0.75,
        falloffStop: 30,
        falloffAlpha: 0.25,
    };
    export const SPOT_TRAIL_CYCLING_DEFAULTS = { ...SPOT_TRAIL_DEFAULTS, ageColorSpan: 0.5, cycleMs: 1000 };

    export const SPOT_SMEAR_DEFAULTS = {
        ...SPOT_TRAIL_DEFAULTS,
        smearMax: 4,
        smearSmoothing: 0.2,
        smearFullStepRatio: 0.03,
    };
    export const SPOT_SMEAR_CYCLING_DEFAULTS = { ...SPOT_SMEAR_DEFAULTS, ageColorSpan: 0.5, cycleMs: 1000 };

    export const DEFAULTS_BY_FAMILY: Record<string, Record<string, number>> = {
        band_1: BAND_DEFAULTS,
        band_1v1: BAND_BLEND_DEFAULTS,
        band_diag_1: BAND_DIAGONAL_DEFAULTS,
        hand_1: HAND_DEFAULTS,
        hand_trail_1: HAND_TRAIL_DEFAULTS,
        hand_trail_2: HAND_TRAIL_CYCLING_DEFAULTS,
        hand_trail_3: HAND_TRAIL_CYCLING_DEFAULTS,
        spot_1: SPOT_DEFAULTS,
        spot_flare_2: SPOT_FLARE_DEFAULTS,
        spot_flare_3: SPOT_FLARE_DEFAULTS,
        spot_ripple_1: SPOT_RIPPLE_DEFAULTS,
        spot_ripple_2: SPOT_RIPPLE_CYCLING_DEFAULTS,
        spot_ripple_3: SPOT_RIPPLE_CYCLING_DEFAULTS,
        spot_smear_1: SPOT_SMEAR_DEFAULTS,
        spot_smear_2: SPOT_SMEAR_CYCLING_DEFAULTS,
        spot_smear_3: SPOT_SMEAR_CYCLING_DEFAULTS,
        spot_trail_1: SPOT_TRAIL_DEFAULTS,
        spot_trail_2: SPOT_TRAIL_CYCLING_DEFAULTS,
        spot_trail_3: SPOT_TRAIL_CYCLING_DEFAULTS,
    };
}
