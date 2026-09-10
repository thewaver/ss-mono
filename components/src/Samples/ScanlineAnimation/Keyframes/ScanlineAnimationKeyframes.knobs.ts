import type { SampleKnobs } from "../../Samples.types";
import type { ScanlineAnimationKeyframes } from "./ScanlineAnimationKeyframes.const";

export namespace ScanlineAnimationKnobs {
    export const SNAKE_KNOBS: SampleKnobs<ScanlineAnimationKeyframes.HorizontalSnakeOpts> = {
        shiftPercent: { kind: "number", label: "Max shift (%)", min: 5, max: 25, step: 5 },
    };

    export const SPLIT_KNOBS: SampleKnobs<ScanlineAnimationKeyframes.HorizontalSplitOpts> = {
        shiftPercent: { kind: "number", label: "Max shift (%)", min: 5, max: 25, step: 5 },
    };

    export const STRETCH_KNOBS: SampleKnobs<ScanlineAnimationKeyframes.HorizontalStretchOpts> = {
        peakScalePercent: { kind: "number", label: "Peak scale (%)", min: 120, max: 200, step: 10 },
    };

    export const HUE_KNOBS: SampleKnobs<ScanlineAnimationKeyframes.HorizontalHueOpts> = {};

    export const BRIGHTNESS_KNOBS: SampleKnobs<ScanlineAnimationKeyframes.HorizontalBrightnessOpts> = {};

    export const GRAYSCALE_KNOBS: SampleKnobs<ScanlineAnimationKeyframes.HorizontalGrayscaleOpts> = {};

    export const WAVE_KNOBS: SampleKnobs<ScanlineAnimationKeyframes._HorizontalWaveOpts> = {
        shiftPercent: { kind: "number", label: "Max shift (%)", min: 5, max: 25, step: 5 },
        waveCount: { kind: "number", label: "Waves", min: 1, max: 8, step: 1 },
    };

    export const ROLL_KNOBS: SampleKnobs<ScanlineAnimationKeyframes._HorizontalRollOpts> = {
        shiftPercent: { kind: "number", label: "Roll shift (%)", min: 20, max: 200, step: 20 },
        seamBrightnessPercent: { kind: "number", label: "Seam brightness (%)", min: 0, max: 100, step: 10 },
    };

    export const DROPOUT_KNOBS: SampleKnobs<ScanlineAnimationKeyframes._HorizontalDropoutOpts> = {
        dropChance: { kind: "number", label: "Drop chance (0-1)", min: 0.1, max: 1, step: 0.1 },
        shiftPercent: { kind: "number", label: "Max shift (%)", min: 5, max: 25, step: 5 },
    };

    export const INTERLACE_KNOBS: SampleKnobs<ScanlineAnimationKeyframes._HorizontalInterlaceOpts> = {
        dipPercent: { kind: "number", label: "Dip (%)", min: 10, max: 90, step: 10 },
        fieldCount: { kind: "number", label: "Fields", min: 2, max: 16, step: 2 },
    };

    export const SKEW_KNOBS: SampleKnobs<ScanlineAnimationKeyframes._HorizontalSkewOpts> = {
        skewDegrees: { kind: "number", label: "Skew (°)", min: 5, max: 45, step: 5 },
    };
}
