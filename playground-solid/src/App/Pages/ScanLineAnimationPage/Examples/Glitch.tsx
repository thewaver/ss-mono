import { createEffect, createMemo, createSignal } from "solid-js";

import {
    ScanlineAnimation,
    SliceAnimationKeyframeUtils,
    SliceAnimationWeights,
    access,
} from "@thewaver/ss-components-solid";
import type { AccessorProps, SliceAnimationBreakpointTriple, SliceStop } from "@thewaver/ss-components-solid";

import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

const WEIGHT_ORIGIN = { row: 0, col: 0 };

const NO_STOPS: SliceStop[] = [];

const WHOLE_PASS = { smoothness: 1 };

const getGlitchBreakpointGroups = (count: number, start: number, end: number) => {
    const result: SliceAnimationBreakpointTriple[] = [];
    const range = end - start;
    const segmentWidth = range / count;

    for (let i = 0; i < count; i++) {
        const segmentStart = start + i * segmentWidth;
        const segmentMid = segmentStart + segmentWidth * 0.5;
        const segmentEnd = segmentStart + segmentWidth;

        result.push([Number(segmentStart.toFixed(3)), Number(segmentMid.toFixed(3)), Number(segmentEnd.toFixed(3))]);
    }

    return result;
};

const getRandomShifts = (breakpointGroupCount: number, lineCount: number, shiftPercent: number, chunkyness: number) => {
    let lastShift: number | undefined;

    return Array.from({ length: breakpointGroupCount }, () =>
        Array.from({ length: lineCount }, () => {
            if (lastShift === undefined || Math.random() > chunkyness) {
                lastShift = Math.random() * shiftPercent * 2 - shiftPercent;
            }

            return lastShift;
        }),
    );
};

type Props = ScanlineAnimationExampleProps &
    AccessorProps<{
        keyframeOpts: { count: number; shiftPercent: number; chunkyness: number };
    }>;

export const GlitchExample = ({ keyframeOpts, weightType, ...otherProps }: Props) => {
    const getBreakpointGroups = createMemo(() => {
        const count = access(keyframeOpts).count;
        const shift = Math.min(0.25, count * 0.05);

        return getGlitchBreakpointGroups(count, 0.5 - shift, 0.5 + shift);
    });

    const generateShifts = () => {
        return getRandomShifts(
            getBreakpointGroups().length,
            access(otherProps.lineCount),
            access(keyframeOpts).shiftPercent,
            access(keyframeOpts).chunkyness,
        );
    };

    const [getShifts, setShifts] = createSignal(generateShifts());

    createEffect(() => {
        setShifts(generateShifts());
    });

    const getAnimation = createMemo(() => {
        const breakpointGroups = getBreakpointGroups();
        const rowStops = Array.from({ length: access(otherProps.lineCount) }, (_, row) =>
            breakpointGroups.flatMap(([start, , end], group): SliceStop[] => {
                const shift = getShifts()[group]?.[row] ?? 0;

                return [
                    { at: start, translateX: 0 },
                    { at: start, translateX: shift },
                    { at: end, translateX: shift },
                    { at: end, translateX: 0 },
                ];
            }),
        );

        return SliceAnimationKeyframeUtils.fromSlices(({ pos }) => rowStops[pos.row] ?? NO_STOPS);
    });

    return (
        <ScanlineAnimation
            {...otherProps}
            computeSliceWeights={(count) =>
                SliceAnimationWeights.computeSliceWeights(access(weightType), count, WEIGHT_ORIGIN)
            }
            computeRootAnimation={(timeline) => {
                const breakpointGroups = getBreakpointGroups();

                for (let g = 0; g < breakpointGroups.length; g++) {
                    const [start, , end] = breakpointGroups[g];

                    if (timeline >= start && timeline <= end) {
                        return { brightness: 125 };
                    }
                }

                return { brightness: 100 };
            }}
            breakpointOpts={WHOLE_PASS}
            computeSliceAnimation={getAnimation()}
            onIterationEnd={() => {
                setShifts(generateShifts());
            }}
        />
    );
};
