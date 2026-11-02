import { MathUtils, RandomUtils } from "@thewaver/ss-utils";

import type {
    SliceAnimationFn,
    SliceStop,
} from "../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { SliceAnimationWeightUtils } from "../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";
import type {
    ScanlineHorizontalBrightnessOpts,
    ScanlineHorizontalDropoutOpts,
    ScanlineHorizontalGrayscaleOpts,
    ScanlineHorizontalHueOpts,
    ScanlineHorizontalInterlaceOpts,
    ScanlineHorizontalSnakeOpts,
    ScanlineHorizontalSplitOpts,
    ScanlineHorizontalStretchOpts,
} from "./ScanlineAnimationKeyframes.types";

const peak = (a: number, b: number, x: number) => {
    const mid = (a + b) * 0.5;

    if (x < a || x > b) return 0;
    if (x <= mid) return (x - a) / (mid - a);
    return (b - x) / (b - mid);
};

const SAMPLED_STOP_COUNT = 32;
const NO_STOPS: SliceStop[] = [];

const toPeakStops = (key: keyof SliceStop, rest: number, top: number): SliceStop[] => [
    { at: 0, [key]: rest },
    { at: 0.5, [key]: top },
    { at: 1, [key]: rest },
];

const toSwingStops = (key: keyof SliceStop, reach: number): SliceStop[] => [
    { at: 0, [key]: 0 },
    { at: 0.25, [key]: -reach },
    { at: 0.5, [key]: 0 },
    { at: 0.75, [key]: reach },
    { at: 1, [key]: 0 },
];

const toSampledStops = (key: keyof SliceStop, compute: (local: number) => number): SliceStop[] =>
    Array.from({ length: SAMPLED_STOP_COUNT + 1 }, (_, idx) => {
        const local = idx / SAMPLED_STOP_COUNT;

        return { at: local, [key]: compute(local) };
    });

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

    export const DEFAULT_HORIZONTAL_DROPOUT_OPTS: Required<ScanlineHorizontalDropoutOpts> = {
        dropChance: 0.3,
        shiftPercent: 15,
    };

    export const DEFAULT_HORIZONTAL_INTERLACE_OPTS: Required<ScanlineHorizontalInterlaceOpts> = {
        dipPercent: 40,
        fieldCount: 8,
    };

    export const createHorizontalSnake = (opts?: ScanlineHorizontalSnakeOpts): SliceAnimationFn =>
        SliceAnimationKeyframeUtils.fromStops(
            toSwingStops("translateX", { ...DEFAULT_HORIZONTAL_SNAKE_OPTS, ...opts }.shiftPercent),
        );

    export const createHorizontalSplit = (opts?: ScanlineHorizontalSplitOpts): SliceAnimationFn => {
        const { shiftPercent } = { ...DEFAULT_HORIZONTAL_SPLIT_OPTS, ...opts };
        const left = toPeakStops("translateX", 0, -shiftPercent);
        const right = toPeakStops("translateX", 0, shiftPercent);

        return SliceAnimationKeyframeUtils.fromSlices(({ pos }) => (MathUtils.isEven(pos.row) ? left : right));
    };

    export const createHorizontalStretch = (opts?: ScanlineHorizontalStretchOpts): SliceAnimationFn =>
        SliceAnimationKeyframeUtils.fromStops(
            toPeakStops("scaleX", 100, { ...DEFAULT_HORIZONTAL_STRETCH_OPTS, ...opts }.peakScalePercent),
        );

    export const createHorizontalHue = (opts?: ScanlineHorizontalHueOpts): SliceAnimationFn =>
        SliceAnimationKeyframeUtils.fromStops(toPeakStops("hue-rotate", 0, 180));

    export const createHorizontalBrightness = (opts?: ScanlineHorizontalBrightnessOpts): SliceAnimationFn =>
        SliceAnimationKeyframeUtils.fromStops(toPeakStops("brightness", 0, 150));

    export const createHorizontalGrayscale = (opts?: ScanlineHorizontalGrayscaleOpts): SliceAnimationFn =>
        SliceAnimationKeyframeUtils.fromStops(toPeakStops("grayscale", 0, 100));

    export const createHorizontalDropout = (opts?: ScanlineHorizontalDropoutOpts): SliceAnimationFn => {
        const { dropChance, shiftPercent } = { ...DEFAULT_HORIZONTAL_DROPOUT_OPTS, ...opts };
        const dropped: SliceStop[] = [
            { at: 0, opacity: 100, translateX: 0 },
            { at: 0.5, opacity: 0, translateX: shiftPercent },
            { at: 1, opacity: 100, translateX: 0 },
        ];

        return SliceAnimationKeyframeUtils.fromSlices(({ pos, count }) =>
            RandomUtils.hash(pos.row, count.row, SliceAnimationWeightUtils.FIXED_HASH_SEED) < dropChance
                ? dropped
                : NO_STOPS,
        );
    };

    export const createHorizontalInterlace = (opts?: ScanlineHorizontalInterlaceOpts): SliceAnimationFn => {
        const { dipPercent, fieldCount } = { ...DEFAULT_HORIZONTAL_INTERLACE_OPTS, ...opts };
        const toStops = (dir: number) =>
            toSampledStops(
                "brightness",
                (local) => 100 + dipPercent * dir * Math.sin(local * fieldCount * Math.PI * 2) * peak(0, 1, local),
            );
        const even = toStops(1);
        const odd = toStops(-1);

        return SliceAnimationKeyframeUtils.fromSlices(({ pos }) => (MathUtils.isEven(pos.row) ? even : odd));
    };
}
