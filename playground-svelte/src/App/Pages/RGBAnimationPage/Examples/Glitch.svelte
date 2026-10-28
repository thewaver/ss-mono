<script lang="ts">
    import { RGBAnimation, RGB_ANIMATION_CHANNELS } from "@thewaver/ss-components-svelte";
    import type { CellAnimationBreakpointTriple } from "@thewaver/ss-components-svelte";

    import type { RGBAnimationExampleProps } from "../RGBAnimationPageSvelte.types";

    const getGlitchBreakpointGroups = (count: number, start: number, end: number) => {
        const result: CellAnimationBreakpointTriple[] = [];
        const range = end - start;
        const segmentWidth = range / count;

        for (let i = 0; i < count; i++) {
            const segmentStart = start + i * segmentWidth;
            const segmentMid = segmentStart + segmentWidth * 0.5;
            const segmentEnd = segmentStart + segmentWidth;

            result.push([
                Number(segmentStart.toFixed(3)),
                Number(segmentMid.toFixed(3)),
                Number(segmentEnd.toFixed(3)),
            ]);
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

    type Props = RGBAnimationExampleProps & {
        glitchOpts: { count: number; shiftPercent: number };
    };

    let { playback = $bindable(), progress = $bindable(), glitchOpts, ...props }: Props = $props();

    const breakpointGroups = $derived.by(() => {
        const count = glitchOpts.count;
        const shift = Math.min(0.25, count * 0.05);

        return getGlitchBreakpointGroups(count, 0.5 - shift, 0.5 + shift);
    });

    const generateShifts = () => getRandomShifts(breakpointGroups.length, glitchOpts.shiftPercent);

    let shifts = $derived(generateShifts());

    const findGroup = (timeline: number) =>
        breakpointGroups.findIndex(([start, , end]) => timeline >= start && timeline <= end);
</script>

<RGBAnimation
    bind:playback
    bind:progress
    src={props.src}
    ariaLabel={props.ariaLabel}
    colorMixing={props.colorMixing}
    animationDurationMs={props.animationDurationMs}
    animationIterationDelayMs={props.animationIterationDelayMs}
    computeRootAnimation={(timeline) => ({ brightness: findGroup(timeline) === -1 ? 100 : 125 })}
    computeChannelAnimation={(defs, timeline) => {
        const group = findGroup(timeline);
        const shift = shifts[group]?.[RGB_ANIMATION_CHANNELS.indexOf(defs.channel)];

        return { translate: shift ?? [0, 0] };
    }}
    onIterationEnd={() => {
        shifts = generateShifts();
    }}
/>
