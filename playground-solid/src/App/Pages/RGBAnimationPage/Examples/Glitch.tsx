import { createEffect, createMemo, createSignal } from "solid-js";

import {
    RGBAnimation,
    RGB_ANIMATION_CHANNELS,
    SliceAnimationKeyframeUtils,
    access,
} from "@thewaver/ss-components-solid";
import type { AccessorProps, SliceAnimationBreakpointTriple, SliceStop } from "@thewaver/ss-components-solid";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageSolid.types";

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

const getRandomShifts = (breakpointGroupCount: number, shiftPercent: number) =>
    Array.from({ length: breakpointGroupCount }, () =>
        RGB_ANIMATION_CHANNELS.map(() => [
            Math.random() * shiftPercent * 2 - shiftPercent,
            Math.random() * shiftPercent * 2 - shiftPercent,
        ]),
    );

type Props = RGBAnimationExampleProps &
    AccessorProps<{
        glitchOpts: { count: number; shiftPercent: number };
    }>;

export const GlitchExample = (props: Props) => {
    const getBreakpointGroups = createMemo(() => {
        const count = access(props.glitchOpts).count;
        const shift = Math.min(0.25, count * 0.05);

        return getGlitchBreakpointGroups(count, 0.5 - shift, 0.5 + shift);
    });

    const generateShifts = () => getRandomShifts(getBreakpointGroups().length, access(props.glitchOpts).shiftPercent);

    const [getShifts, setShifts] = createSignal(generateShifts());

    createEffect(() => {
        setShifts(generateShifts());
    });

    const getAnimation = createMemo(() => {
        const channelStops = RGB_ANIMATION_CHANNELS.map((_, channel) =>
            getBreakpointGroups().flatMap(([start, , end], group): SliceStop[] => {
                const [x, y] = getShifts()[group]?.[channel] ?? [0, 0];

                return [
                    { at: start, translateX: 0, translateY: 0 },
                    { at: start, translateX: x, translateY: y },
                    { at: end, translateX: x, translateY: y },
                    { at: end, translateX: 0, translateY: 0 },
                ];
            }),
        );

        return SliceAnimationKeyframeUtils.fromSlices(({ pos }) => channelStops[pos.col] ?? channelStops[0]);
    });

    const findGroup = (timeline: number) =>
        getBreakpointGroups().findIndex(([start, , end]) => timeline >= start && timeline <= end);

    return (
        <RGBAnimation
            src={props.src}
            ariaLabel={props.ariaLabel}
            playback={props.playback}
            progress={props.progress}
            colorMixing={props.colorMixing}
            animationDurationMs={props.animationDurationMs}
            animationIterationDelayMs={props.animationIterationDelayMs}
            computeRootAnimation={(timeline) => ({ brightness: findGroup(timeline) === -1 ? 100 : 125 })}
            computeSliceAnimation={getAnimation()}
            onIterationEnd={() => {
                setShifts(generateShifts());
            }}
        />
    );
};
