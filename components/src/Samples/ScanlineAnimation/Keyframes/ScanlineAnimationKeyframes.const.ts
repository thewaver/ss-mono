import { MathUtils, RandomUtils } from "@thewaver/ss-utils";

import type {
    ScanlineAnimationEvaluationDefs,
    ScanlineAnimationEvaluationResult,
} from "../../../Exotics/Animations/ScanlineAnimation/ScanlineAnimation.types";
import type { CellAnimationBreakpointTriple } from "../../../Generators/CellAnimationBreakpoints/CellAnimationBreakpoints.types";
import type {
    CellAnimationFn,
    CellStop,
} from "../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";
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

const SAMPLED_STOP_COUNT = 32;
const NO_STOPS: CellStop[] = [];

const toPeakStops = (key: keyof CellStop, rest: number, top: number): CellStop[] => [
    { at: 0, [key]: rest },
    { at: 0.5, [key]: top },
    { at: 1, [key]: rest },
];

const toSwingStops = (key: keyof CellStop, reach: number): CellStop[] => [
    { at: 0, [key]: 0 },
    { at: 0.25, [key]: -reach },
    { at: 0.5, [key]: 0 },
    { at: 0.75, [key]: reach },
    { at: 1, [key]: 0 },
];

const toSampledStops = (key: keyof CellStop, compute: (local: number) => number): CellStop[] =>
    Array.from({ length: SAMPLED_STOP_COUNT + 1 }, (_, idx) => {
        const local = idx / SAMPLED_STOP_COUNT;

        return { at: local, [key]: compute(local) };
    });

const perRow = (compute: (row: number, rowCount: number) => CellStop[]) => {
    const cache = new Map<string, CellStop[]>();

    return CellAnimationKeyframeUtils.fromSlices(({ pos, count }) => {
        const key = `${pos.row}/${count.row}`;
        const stops = cache.get(key) ?? compute(pos.row, count.row);

        cache.set(key, stops);

        return stops;
    });
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
            RandomUtils.hash(defs.pos.row, defs.count.row, CellAnimationWeightUtils.FIXED_HASH_SEED) >=
            mergedOpts.dropChance
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

    export const createHorizontalSnake = (opts?: ScanlineHorizontalSnakeOpts): CellAnimationFn =>
        CellAnimationKeyframeUtils.fromStops(
            toSwingStops("translateX", { ...DEFAULT_HORIZONTAL_SNAKE_OPTS, ...opts }.shiftPercent),
        );

    export const createHorizontalSplit = (opts?: ScanlineHorizontalSplitOpts): CellAnimationFn => {
        const { shiftPercent } = { ...DEFAULT_HORIZONTAL_SPLIT_OPTS, ...opts };
        const left = toPeakStops("translateX", 0, -shiftPercent);
        const right = toPeakStops("translateX", 0, shiftPercent);

        return CellAnimationKeyframeUtils.fromSlices(({ pos }) => (MathUtils.isEven(pos.row) ? left : right));
    };

    export const createHorizontalStretch = (opts?: ScanlineHorizontalStretchOpts): CellAnimationFn =>
        CellAnimationKeyframeUtils.fromStops(
            toPeakStops("scaleX", 100, { ...DEFAULT_HORIZONTAL_STRETCH_OPTS, ...opts }.peakScalePercent),
        );

    export const createHorizontalHue = (opts?: ScanlineHorizontalHueOpts): CellAnimationFn =>
        CellAnimationKeyframeUtils.fromStops(toPeakStops("hue-rotate", 0, 180));

    export const createHorizontalBrightness = (opts?: ScanlineHorizontalBrightnessOpts): CellAnimationFn =>
        CellAnimationKeyframeUtils.fromStops(toPeakStops("brightness", 0, 150));

    export const createHorizontalGrayscale = (opts?: ScanlineHorizontalGrayscaleOpts): CellAnimationFn =>
        CellAnimationKeyframeUtils.fromStops(toPeakStops("grayscale", 0, 100));

    export const _createHorizontalWave = (opts?: _ScanlineHorizontalWaveOpts): CellAnimationFn => {
        const { shiftPercent, waveCount } = { ...DEFAULT_HORIZONTAL_WAVE_OPTS, ...opts };

        return perRow((row, rowCount) =>
            toSampledStops(
                "translateX",
                (local) =>
                    shiftPercent *
                    peak(0, 1, local) *
                    Math.sin(((row / Math.max(rowCount, 1)) * waveCount + local) * Math.PI * 2),
            ),
        );
    };

    export const _createHorizontalRoll = (opts?: _ScanlineHorizontalRollOpts): CellAnimationFn => {
        const { shiftPercent, seamBrightnessPercent } = { ...DEFAULT_HORIZONTAL_ROLL_OPTS, ...opts };

        return CellAnimationKeyframeUtils.fromStops([
            { at: 0, translateY: shiftPercent, brightness: 100 },
            { at: 0.5, brightness: 100 + seamBrightnessPercent },
            { at: 1, translateY: 0, brightness: 100 },
        ]);
    };

    export const _createHorizontalDropout = (opts?: _ScanlineHorizontalDropoutOpts): CellAnimationFn => {
        const { dropChance, shiftPercent } = { ...DEFAULT_HORIZONTAL_DROPOUT_OPTS, ...opts };
        const dropped: CellStop[] = [
            { at: 0, opacity: 100, translateX: 0 },
            { at: 0.5, opacity: 0, translateX: shiftPercent },
            { at: 1, opacity: 100, translateX: 0 },
        ];

        return CellAnimationKeyframeUtils.fromSlices(({ pos, count }) =>
            RandomUtils.hash(pos.row, count.row, CellAnimationWeightUtils.FIXED_HASH_SEED) < dropChance
                ? dropped
                : NO_STOPS,
        );
    };

    export const _createHorizontalInterlace = (opts?: _ScanlineHorizontalInterlaceOpts): CellAnimationFn => {
        const { dipPercent, fieldCount } = { ...DEFAULT_HORIZONTAL_INTERLACE_OPTS, ...opts };
        const toStops = (dir: number) =>
            toSampledStops(
                "brightness",
                (local) => 100 + dipPercent * dir * Math.sin(local * fieldCount * Math.PI * 2) * peak(0, 1, local),
            );
        const even = toStops(1);
        const odd = toStops(-1);

        return CellAnimationKeyframeUtils.fromSlices(({ pos }) => (MathUtils.isEven(pos.row) ? even : odd));
    };

    export const _createHorizontalSkew = (opts?: _ScanlineHorizontalSkewOpts): CellAnimationFn =>
        CellAnimationKeyframeUtils.fromStops(
            toSwingStops("skewX", { ...DEFAULT_HORIZONTAL_SKEW_OPTS, ...opts }.skewDegrees),
        );
}
