<script lang="ts">
    import { CellAnimationWeights, ScanlineAnimation } from "@thewaver/ss-components-svelte";
    import type { CellAnimationBreakpointTriple } from "@thewaver/ss-components-svelte";
    import type { Index2d } from "@thewaver/ss-utils";

    import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

    const WEIGHT_ORIGIN = { row: 0, col: 0 };

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

    const getRandomShifts = (
        breakpointGroupCount: number,
        lineCount: number,
        shiftPercent: number,
        chunkyness: number,
    ) => {
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

    type Props = ScanlineAnimationExampleProps & {
        keyframeOpts: { count: number; shiftPercent: number; chunkyness: number };
    };

    let { playback = $bindable(), keyframeOpts, weightType, ...otherProps }: Props = $props();

    const breakpointGroups = $derived.by(() => {
        const count = keyframeOpts.count;
        const shift = Math.min(0.25, count * 0.05);

        return getGlitchBreakpointGroups(count, 0.5 - shift, 0.5 + shift);
    });

    const generateShifts = () =>
        getRandomShifts(
            breakpointGroups.length,
            otherProps.lineCount,
            keyframeOpts.shiftPercent,
            keyframeOpts.chunkyness,
        );

    let shifts = $derived(generateShifts());

    const computeCellWeights = (count: Index2d) =>
        CellAnimationWeights.computeCellWeights(weightType, count, WEIGHT_ORIGIN);
</script>

<ScanlineAnimation
    {...otherProps}
    bind:playback
    {computeCellWeights}
    computeRootAnimation={(timeline) => {
        for (let g = 0; g < breakpointGroups.length; g++) {
            const [start, , end] = breakpointGroups[g];

            if (timeline >= start && timeline <= end) {
                return { brightness: 125 };
            }
        }

        return { brightness: 100 };
    }}
    computeScanlineAnimation={(defs, timeline) => {
        for (let g = 0; g < breakpointGroups.length; g++) {
            const [start, , end] = breakpointGroups[g];

            if (timeline >= start && timeline <= end) {
                const shiftGroup = shifts[g];
                const shiftVal = shiftGroup ? (shiftGroup[defs.pos.row] ?? 0) : 0;

                return { translateX: shiftVal };
            }
        }

        return { translateX: 0 };
    }}
    onIterationEnd={() => {
        shifts = generateShifts();
    }}
/>
