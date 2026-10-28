import { createEffect, createMemo, createSignal } from "solid-js";

import { RGBAnimation, RGB_ANIMATION_CHANNELS, access } from "@thewaver/ss-components-solid";
import type { AccessorProps, CellAnimationBreakpointTriple } from "@thewaver/ss-components-solid";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageSolid.types";

const getGlitchBreakpointGroups = (count: number, start: number, end: number) => {
    const result: CellAnimationBreakpointTriple[] = [];
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
            computeChannelAnimation={(defs, timeline) => {
                const group = findGroup(timeline);
                const shift = getShifts()[group]?.[RGB_ANIMATION_CHANNELS.indexOf(defs.channel)];

                return { translate: shift ?? [0, 0] };
            }}
            onIterationEnd={() => {
                setShifts(generateShifts());
            }}
        />
    );
};
