import { MathUtils } from "@thewaver/ss-utils";

import type {
    ScanlineAnimationEvaluationDefs,
    ScanlineAnimationEvaluationResult,
} from "../../../Exotics/ScanlineAnimation/ScanlineAnimation.types";
import type { CellAnimationBreakpointTriple } from "../../../Generators/CellAnimationBreakpoints/CellAnimationBreakpoints.types";
import { CellAnimationWeightUtils } from "../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";
import type {
    ScanlineHorizontalBrightnessOpts,
    ScanlineHorizontalGrayscaleOpts,
    ScanlineHorizontalHueOpts,
    ScanlineHorizontalSnakeOpts,
    ScanlineHorizontalSplitOpts,
    ScanlineHorizontalStretchOpts,
    _ScanlineHorizontalDropoutOpts,
    _ScanlineHorizontalInterlaceOpts,
    _ScanlineHorizontalRollOpts,
    _ScanlineHorizontalSkewOpts,
    _ScanlineHorizontalWaveOpts,
} from "./ScanlineAnimationKeyframes.types";

const peak = (a: number, b: number, x: number) => {
    const mid = (a + b) * 0.5;

    if (x < a || x > b) return 0;
    if (x <= mid) return (x - a) / (mid - a);
    return (b - x) / (b - mid);
};
const ramp = (a: number, b: number, x: number) => {
    if (x <= a) return 0;
    if (x >= b) return 1;

    return (x - a) / (b - a);
};

export namespace ScanlineAnimationKeyframes {
    export const DEFAULT_HORIZONTAL_SNAKE_OPTS: Required<ScanlineHorizontalSnakeOpts> = {
        shiftPercent: 5,
    };

    export const DEFAULT_HORIZONTAL_SPLIT_OPTS: Required<ScanlineHorizontalSplitOpts> = {
        shiftPercent: 10,
    };

    export const DEFAULT_HORIZONTAL_STRETCH_OPTS: Required<ScanlineHorizontalStretchOpts> = {
        peakScalePercent: 150,
    };

    export const DEFAULT_HORIZONTAL_WAVE_OPTS: Required<_ScanlineHorizontalWaveOpts> = {
        shiftPercent: 8,
        waveCount: 3,
    };

    export const DEFAULT_HORIZONTAL_ROLL_OPTS: Required<_ScanlineHorizontalRollOpts> = {
        shiftPercent: 100,
        seamBrightnessPercent: 40,
    };

    export const DEFAULT_HORIZONTAL_DROPOUT_OPTS: Required<_ScanlineHorizontalDropoutOpts> = {
        dropChance: 0.3,
        shiftPercent: 15,
    };

    export const DEFAULT_HORIZONTAL_INTERLACE_OPTS: Required<_ScanlineHorizontalInterlaceOpts> = {
        dipPercent: 40,
        fieldCount: 8,
    };

    export const DEFAULT_HORIZONTAL_SKEW_OPTS: Required<_ScanlineHorizontalSkewOpts> = {
        skewDegrees: 20,
    };

    export const computeHorizontalSnake = (
        [b0, b1, b2]: CellAnimationBreakpointTriple,
        defs: ScanlineAnimationEvaluationDefs,
        t: number,
        opts?: ScanlineHorizontalSnakeOpts,
    ): ScanlineAnimationEvaluationResult => {
        const mergedOpts = { ...DEFAULT_HORIZONTAL_SNAKE_OPTS, ...opts };
        const p = peak(b1, b2, t) - peak(b0, b1, t);

        return { translateX: mergedOpts.shiftPercent * p };
    };

    export const computeHorizontalSplit = (
        [b0, b1, b2]: CellAnimationBreakpointTriple,
        defs: ScanlineAnimationEvaluationDefs,
        t: number,
        opts?: ScanlineHorizontalSplitOpts,
    ): ScanlineAnimationEvaluationResult => {
        const mergedOpts = { ...DEFAULT_HORIZONTAL_SPLIT_OPTS, ...opts };
        const dir = MathUtils.isEven(defs.pos.row) ? -1 : 1;
        const p = peak(b0, b2, t);

        return { translateX: dir * mergedOpts.shiftPercent * p };
    };

    export const computeHorizontalStretch = (
        [b0, b1, b2]: CellAnimationBreakpointTriple,
        defs: ScanlineAnimationEvaluationDefs,
        t: number,
        opts?: ScanlineHorizontalStretchOpts,
    ): ScanlineAnimationEvaluationResult => {
        const mergedOpts = { ...DEFAULT_HORIZONTAL_STRETCH_OPTS, ...opts };
        const p = peak(b0, b2, t);

        return { scaleX: 100 + (mergedOpts.peakScalePercent - 100) * p };
    };

    export const computeHorizontalHue = (
        [b0, b1, b2]: CellAnimationBreakpointTriple,
        defs: ScanlineAnimationEvaluationDefs,
        t: number,
        opts?: ScanlineHorizontalHueOpts,
    ): ScanlineAnimationEvaluationResult => {
        const p = peak(b0, b2, t);

        return { "hue-rotate": 180 * p };
    };

    export const computeHorizontalBrightness = (
        [b0, b1, b2]: CellAnimationBreakpointTriple,
        defs: ScanlineAnimationEvaluationDefs,
        t: number,
        opts?: ScanlineHorizontalBrightnessOpts,
    ): ScanlineAnimationEvaluationResult => {
        const p = peak(b0, b2, t);

        return { brightness: 150 * p };
    };

    export const computeHorizontalGrayscale = (
        [b0, b1, b2]: CellAnimationBreakpointTriple,
        defs: ScanlineAnimationEvaluationDefs,
        t: number,
        opts?: ScanlineHorizontalGrayscaleOpts,
    ): ScanlineAnimationEvaluationResult => {
        const p = peak(b0, b2, t);

        return { grayscale: 100 * p };
    };

    export const _computeHorizontalWave = (
        [b0, b1, b2]: CellAnimationBreakpointTriple,
        defs: ScanlineAnimationEvaluationDefs,
        t: number,
        opts?: _ScanlineHorizontalWaveOpts,
    ): ScanlineAnimationEvaluationResult => {
        const mergedOpts = { ...DEFAULT_HORIZONTAL_WAVE_OPTS, ...opts };
        const envelope = peak(b0, b2, t);
        const phase = ((defs.pos.row / Math.max(defs.count.row, 1)) * mergedOpts.waveCount + t) * Math.PI * 2;

        return { translateX: mergedOpts.shiftPercent * envelope * Math.sin(phase) };
    };

    export const _computeHorizontalRoll = (
        [b0, b1, b2]: CellAnimationBreakpointTriple,
        defs: ScanlineAnimationEvaluationDefs,
        t: number,
        opts?: _ScanlineHorizontalRollOpts,
    ): ScanlineAnimationEvaluationResult => {
        const mergedOpts = { ...DEFAULT_HORIZONTAL_ROLL_OPTS, ...opts };

        return {
            translateY: mergedOpts.shiftPercent * (1 - ramp(b0, b2, t)),
            brightness: 100 + mergedOpts.seamBrightnessPercent * peak(b0, b2, t),
        };
    };

    export const _computeHorizontalDropout = (
        [b0, b1, b2]: CellAnimationBreakpointTriple,
        defs: ScanlineAnimationEvaluationDefs,
        t: number,
        opts?: _ScanlineHorizontalDropoutOpts,
    ): ScanlineAnimationEvaluationResult => {
        const mergedOpts = { ...DEFAULT_HORIZONTAL_DROPOUT_OPTS, ...opts };

        if (
            CellAnimationWeightUtils.hashToUnit(
                defs.pos.row,
                defs.count.row,
                CellAnimationWeightUtils.FIXED_HASH_SEED,
            ) >= mergedOpts.dropChance
        )
            return {};

        const p = peak(b0, b2, t);

        return { opacity: 100 - 100 * p, translateX: mergedOpts.shiftPercent * p };
    };

    export const _computeHorizontalInterlace = (
        [b0, b1, b2]: CellAnimationBreakpointTriple,
        defs: ScanlineAnimationEvaluationDefs,
        t: number,
        opts?: _ScanlineHorizontalInterlaceOpts,
    ): ScanlineAnimationEvaluationResult => {
        const mergedOpts = { ...DEFAULT_HORIZONTAL_INTERLACE_OPTS, ...opts };
        const envelope = peak(b0, b2, t);
        const field = Math.sin(t * mergedOpts.fieldCount * Math.PI * 2);
        const dir = MathUtils.isEven(defs.pos.row) ? 1 : -1;

        return { brightness: 100 + mergedOpts.dipPercent * dir * field * envelope };
    };

    export const _computeHorizontalSkew = (
        [b0, b1, b2]: CellAnimationBreakpointTriple,
        defs: ScanlineAnimationEvaluationDefs,
        t: number,
        opts?: _ScanlineHorizontalSkewOpts,
    ): ScanlineAnimationEvaluationResult => {
        const mergedOpts = { ...DEFAULT_HORIZONTAL_SKEW_OPTS, ...opts };
        const p = peak(b1, b2, t) - peak(b0, b1, t);

        return { skewX: mergedOpts.skewDegrees * p };
    };
}
