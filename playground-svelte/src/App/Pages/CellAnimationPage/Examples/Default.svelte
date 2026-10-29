<script lang="ts">
    import {
        CellAnimation,
        CellAnimationBreakpointUtils,
        type CellAnimationEvaluationDefs,
        CellAnimationKeyframes,
        CellAnimationOrigins,
        CellAnimationPlaybackUtils,
        CellAnimationWeights,
    } from "@thewaver/ss-components-svelte";
    import type { Index2d } from "@thewaver/ss-utils";

    import type { CellAnimationSourcedExampleProps } from "../CellAnimationPage.types";

    let {
        playback = $bindable(),
        progress = $bindable(0),
        animationType,
        breakpointOpts,
        playbackOpts,
        originType,
        weightType,
        weightOpts,
        ...otherProps
    }: CellAnimationSourcedExampleProps = $props();

    const origin = $derived(CellAnimationOrigins.computeOrigin(originType, otherProps.cellCount));

    const settings = $derived({
        animationType,
        breakpointOpts: { ...breakpointOpts },
        playbackOpts: { ...playbackOpts },
        durationMs: otherProps.animationDurationMs,
        origin,
    });

    const cellsWithOrigin = new WeakMap<
        CellAnimationEvaluationDefs,
        CellAnimationEvaluationDefs & { origin: Index2d }
    >();

    const computeFrame = (timeline: number, frameSettings: typeof settings) => ({
        timeline,
        settings: frameSettings,
        breakpointOpts: CellAnimationPlaybackUtils.computeBreakpointOpts(
            frameSettings.breakpointOpts,
            timeline,
            frameSettings.playbackOpts,
        ),
        globalTimeline: CellAnimationPlaybackUtils.computeGlobalTimeline(
            timeline,
            frameSettings.durationMs,
            frameSettings.playbackOpts,
        ),
    });

    let frame: ReturnType<typeof computeFrame> | undefined;

    const getFrame = (timeline: number) => {
        const current = settings;

        if (frame?.timeline !== timeline || frame.settings !== current) frame = computeFrame(timeline, current);

        return frame;
    };

    const withOrigin = (defs: CellAnimationEvaluationDefs, cellOrigin: Index2d) => {
        const cached = cellsWithOrigin.get(defs);

        if (cached?.origin === cellOrigin) return cached;

        const cell = { ...defs, origin: cellOrigin };

        cellsWithOrigin.set(defs, cell);

        return cell;
    };

    const computeCellAnimation = (defs: CellAnimationEvaluationDefs, timeline: number) => {
        const { settings: frameSettings, breakpointOpts: cellBreakpointOpts, globalTimeline } = getFrame(timeline);

        return CellAnimationKeyframes.computeAnimation(
            frameSettings.animationType,
            CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, cellBreakpointOpts),
            withOrigin(defs, frameSettings.origin),
            globalTimeline,
            frameSettings.breakpointOpts.easing,
        );
    };
</script>

<CellAnimation
    {...otherProps}
    bind:playback
    bind:progress
    animationDurationMs={CellAnimationPlaybackUtils.computeCycleDurationMs(
        otherProps.animationDurationMs,
        playbackOpts,
    )}
    computeCellWeights={(count) => CellAnimationWeights.computeCellWeights(weightType, count, origin, weightOpts)}
    {computeCellAnimation}
/>
