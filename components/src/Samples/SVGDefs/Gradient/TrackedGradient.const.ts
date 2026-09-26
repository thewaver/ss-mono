import type { TrackedGradientDefaultsByFamily } from "../SVGDefs.types";

const RIPPLE_SOURCE_SCALE = 0.25;

export namespace TrackedGradientDefaults {
    export const BAND_DEFAULTS = {
        coreStop: 48,
        coreAlpha: 0.5,
        falloffSpread: 24,
        falloffAlpha: 0.25,
        bandTravel: 1,
    };

    export const BAND_BLEND_DEFAULTS = { ...BAND_DEFAULTS, coreAlpha: 0.5, falloffAlpha: 0.15 };

    export const BAND_DIAGONAL_DEFAULTS = { ...BAND_DEFAULTS, bandTravel: 1.25, bandAngle: 45 };

    export const HAND_DEFAULTS = { sweepArc: 90, peakAlpha: 1 };

    export const HAND_TRAIL_DEFAULTS = { trailAlpha: 0.25, trailDecay: 2.2, sweepArc: 90 };

    export const HAND_TRAIL_CYCLING_DEFAULTS = { ...HAND_TRAIL_DEFAULTS, ageColorSpan: 0.5, cycleMs: 1000 };

    export const SPOT_DEFAULTS = {
        circular: true,
        glowScale: 0.8,
        coreStop: 4,
        coreAlpha: 0.5,
        falloffStop: 32,
        falloffAlpha: 0.25,
    };

    export const SPOT_FLARE_DEFAULTS = {
        ...SPOT_DEFAULTS,
        ghostSaturation: 0.5,
        ghostLuminosity: 1.25,
        ghostNearGrowth: 1,
        ghostFarGrowth: 0.5,
    };

    export const SPOT_RIPPLE_DEFAULTS = {
        circular: true,
        sourceScale: RIPPLE_SOURCE_SCALE,
        sourceStop: 8,
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

    export const SPOT_TRAIL_DEFAULTS = { ...SPOT_DEFAULTS, trailAlpha: 0.25, trailDecay: 2.2 };

    export const SPOT_TRAIL_CYCLING_DEFAULTS = { ...SPOT_TRAIL_DEFAULTS, ageColorSpan: 0.5, cycleMs: 1000 };

    export const SPOT_SMEAR_DEFAULTS = {
        ...SPOT_TRAIL_DEFAULTS,
        smearMax: 4,
        smearSmoothing: 0.2,
        smearFullStepRatio: 0.03,
    };

    export const SPOT_SMEAR_CYCLING_DEFAULTS = { ...SPOT_SMEAR_DEFAULTS, ageColorSpan: 0.5, cycleMs: 1000 };

    export const DEFAULTS_BY_FAMILY: TrackedGradientDefaultsByFamily = {
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
