<script lang="ts">
    import {
        CELL_ANIMATION_DEFAULTS,
        CELL_ANIMATION_FINAL_FRAMES,
        CellAnimationBreakpoints,
        CellAnimationKeyframes,
        CellAnimationOrigins,
        CellAnimationPlayback,
        CellAnimationPlaybackUtils,
        CellAnimationWeights,
    } from "@thewaver/ss-components-svelte";
    import type {
        SVGDefsSamples,
        CellAnimationBreakpointOpts,
        CellAnimationFinalFrame,
        CellAnimationPlaybackOpts,
        WeightOpts,
    } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";
    import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";
    import type { CellAnimationSourceKind } from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.types";
    import type { Index2d, Size2d } from "@thewaver/ss-utils";

    import { CellAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/CellAnimations.const";
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageFileField from "../../PageComponents/Field/PageFileField.svelte";
    import PageGroupedSelectField from "../../PageComponents/Field/PageGroupedSelectField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsDivider from "../../PageComponents/PropsPanel/PagePropsDivider.svelte";
    import PagePropsGroups from "../../PageComponents/PropsPanel/PagePropsGroups.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import { SVGDefsSources } from "../../PageComponents/SVGDefsSources/SVGDefsSourcesSvelte.const";
    import type { CellAnimationExampleProps } from "./CellAnimationPage.types";
    import WipeExample from "./Examples/Wipe.svelte";
    import SourcedExampleWrapper from "./SourcedExampleWrapper.svelte";
    import StressTestWrapper from "./StressTestWrapper.svelte";
    import {
        EXAMPLE_NAMES,
        PERCENT,
        SOURCE_READOUTS,
    } from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.const";

    const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/CellAnimationPage/Examples/Default.svelte";
    const WIPE_EXAMPLE_PATH = "/src/App/Pages/CellAnimationPage/Examples/Wipe.svelte";

    const computeContainerWidth = (size: Size2d, longestSide: number) =>
        (longestSide * size.width) / Math.max(size.width, size.height);

    const extractOptionGroupWord = (key: string) => key.replace(/^_/, "").match(/^[a-z]+/)?.[0] ?? key;

    const groupOptions = <T extends string>(keys: readonly T[]) => {
        const result: Record<string, T[]> = {};

        for (const key of keys) {
            const group = extractOptionGroupWord(key);

            result[group] ??= [];
            result[group].push(key);
        }

        return Object.entries(result);
    };

    const GROUPPED_WEIGHTS = groupOptions(CellAnimationWeights.WEIGHT_TYPES);
    const GROUPPED_ANIMATIONS = groupOptions(CellAnimationKeyframes.ANIMATION_TYPES);

    let playback = $state(true);
    let sourcedPlayback = $state(true);
    let sourcedProgress = $state(0);

    let sourceKind = $state<CellAnimationSourceKind>(CellAnimationKnobs.STARTING_SOURCE_KIND);
    let imageSrc = $state(knight_profile);
    let gradientKey = $state<SVGDefsSamples.Gradient.Timed.SampleKey>(CellAnimationKnobs.STARTING_GRADIENT_KEY);
    let patternKey = $state<SVGDefsSamples.Pattern.Timed.SampleKey>(CellAnimationKnobs.STARTING_PATTERN_KEY);
    let sourceRatio = $state<SVGDefsSources.SourceRatio>(CellAnimationKnobs.DEFAULT_SOURCE_RATIO);

    let originType = $state<CellAnimationOrigins.OriginType>(CellAnimationKnobs.STARTING_ORIGIN_KEY);
    let weightType = $state<CellAnimationWeights.WeightType>(CellAnimationKnobs.STARTING_WEIGHT_KEY);
    let animationType = $state<CellAnimationKeyframes.AnimationType>(CellAnimationKnobs.STARTING_ANIMATION_KEY);
    let animationDurationMs = $state(CELL_ANIMATION_DEFAULTS.animationDurationMs);
    let animationIterationDelayMs = $state(CELL_ANIMATION_DEFAULTS.animationIterationDelayMs);
    let animationIterationCount = $state(CellAnimationKnobs.ENDLESS_ITERATION_COUNT);
    let finalFrame = $state<CellAnimationFinalFrame>(CELL_ANIMATION_DEFAULTS.finalFrame);
    let cellCount = $state.raw<Index2d>({ ...CellAnimationKnobs.STARTING_CELL_COUNT });
    let weightOpts = $state.raw<WeightOpts>({ ...CellAnimationKnobs.STARTING_WEIGHT_OPTS });
    let breakpointOpts = $state.raw<CellAnimationBreakpointOpts>({ ...CellAnimationKnobs.STARTING_BREAKPOINT_OPTS });
    let playbackOpts = $state.raw<CellAnimationPlaybackOpts>({ ...CellAnimationKnobs.STARTING_PLAYBACK_OPTS });

    const commonProps: Omit<CellAnimationExampleProps, "playback"> = $derived({
        cellCount,
        originType,
        weightType,
        weightOpts,
        breakpointOpts,
        playbackOpts,
        animationType,
        animationDurationMs,
        animationIterationCount:
            animationIterationCount === CellAnimationKnobs.ENDLESS_ITERATION_COUNT ? Infinity : animationIterationCount,
        animationIterationDelayMs,
        finalFrame,
    });

    const sourceSize = $derived(SVGDefsSources.computeSourceSize(sourceRatio));

    const cycleDurationMs = $derived(
        CellAnimationPlaybackUtils.computeCycleDurationMs(animationDurationMs, playbackOpts),
    );

    const sourcedSrc = $derived.by(() => {
        if (sourceKind === "gradient") {
            return SVGDefsSources.computeGradientSource(
                gradientKey,
                sourceSize,
                cycleDurationMs,
                animationIterationDelayMs,
            );
        }

        if (sourceKind === "pattern") {
            return SVGDefsSources.computePatternSource(patternKey, sourceSize, cycleDurationMs);
        }

        return imageSrc;
    });

    const computeSourcedWidth = (longestSide: number) =>
        sourceKind === "image" ? longestSide : computeContainerWidth(sourceSize, longestSide);

    const examples: ExampleDefs[] = [
        {
            key: "source",
            name: EXAMPLE_NAMES.source,
            readout: () =>
                `${Math.round(sourcedProgress * PERCENT)}% through the pass, ${sourcedPlayback ? "running" : "stopped"} — ${SOURCE_READOUTS[sourceKind]}`,
            component: sourcedExample,
            path: DEFAULT_EXAMPLE_PATH,
        },
        {
            key: "wipe",
            name: EXAMPLE_NAMES.wipe,
            readout: () =>
                "a solid-color picture fixed over the whole viewport, its cells growing in by the chosen weight and going back out after a hold; the lozenge is each cell turned 45° and grown past its box until it covers it, and there is no circle, since a cell can only be transformed and filtered, not reshaped",
            component: wipeExample,
            path: WIPE_EXAMPLE_PATH,
        },
        {
            key: "stressTest",
            name: EXAMPLE_NAMES.stressTest,
            component: stressTestExample,
        },
    ];
</script>

{#snippet sourcedExample()}
    <SourcedExampleWrapper
        {...commonProps}
        bind:playback={sourcedPlayback}
        bind:progress={sourcedProgress}
        src={sourcedSrc}
        isPagePlaying={playback}
        computeWidth={computeSourcedWidth}
    />
{/snippet}

{#snippet wipeExample()}
    <WipeExample {...commonProps} />
{/snippet}

{#snippet stressTestExample()}
    <StressTestWrapper {...commonProps} bind:playback src={sourcedSrc} computeWidth={computeSourcedWidth} />
{/snippet}

<div class={styles.root}>
    <PagePropsGroups>
        <PagePropsPanel scope={"sample"}>
            <PageProp
                itemKey={"sourceKind"}
                controls={"Picks the kind of example picture sent to CellAnimationProps.src"}
                label={"Source"}
                hint={"What the cells are cut from, in the first example and the stress test: a photograph, or one of the Shape page's gradients or patterns drawn into a picture. Choosing one brings its own knobs with it."}
            >
                <PageSelectField
                    value={sourceKind}
                    values={CellAnimationKnobs.SOURCE_KINDS}
                    ariaLabel={"Source"}
                    onChange={(next) => {
                        sourceKind = next;
                    }}
                />
            </PageProp>

            {#if sourceKind === "image"}
                <PageProp
                    itemKey={"image"}
                    controls={"Picks the example picture sent to CellAnimationProps.src"}
                    label={"Image"}
                    hint={"Swaps in a picture of your own, so the cells can be watched against something other than the sample."}
                >
                    <PageFileField
                        accept={"image/*"}
                        ariaLabel={"Image"}
                        onPick={(file) => {
                            imageSrc = URL.createObjectURL(file);
                        }}
                    />
                </PageProp>
            {/if}

            {#if sourceKind === "gradient"}
                <PageProp
                    itemKey={"gradient"}
                    controls={"Picks the gradient drawn into the example picture sent to CellAnimationProps.src"}
                    label={"Gradient"}
                    hint={"Which animated gradient is rendered into the picture the cells are cut from."}
                >
                    <PageSelectField
                        value={gradientKey}
                        values={SVGDefsSources.GRADIENT_KEYS}
                        ariaLabel={"Gradient"}
                        onChange={(next) => {
                            gradientKey = next;
                        }}
                    />
                </PageProp>
            {/if}

            {#if sourceKind === "pattern"}
                <PageProp
                    itemKey={"pattern"}
                    controls={"Picks the pattern drawn into the example picture sent to CellAnimationProps.src"}
                    label={"Pattern"}
                    hint={"Which repeating pattern is rendered into the picture the cells are cut from."}
                >
                    <PageSelectField
                        value={patternKey}
                        values={SVGDefsSources.PATTERN_KEYS}
                        ariaLabel={"Pattern"}
                        onChange={(next) => {
                            patternKey = next;
                        }}
                    />
                </PageProp>
            {/if}

            {#if sourceKind !== "image"}
                <PageProp
                    itemKey={"sourceRatio"}
                    controls={"Sets the shape of the example picture sent to CellAnimationProps.src"}
                    label={"Ratio"}
                    hint={"The shape of the picture the gradient or pattern is drawn into, which decides how the cells are proportioned."}
                >
                    <PageSelectField
                        value={sourceRatio}
                        values={SVGDefsSources.SOURCE_RATIOS}
                        ariaLabel={"Ratio"}
                        onChange={(next) => {
                            sourceRatio = next;
                        }}
                    />
                </PageProp>
            {/if}
        </PagePropsPanel>

        <PagePropsDivider />

        <PagePropsPanel scope={"global"}>
        <PageProp
            itemKey={"cellCountCols"}
            controls={"Sets CellAnimationProps.cellCount"}
            label={"Cell count (cols x rows)"}
            hint={
                "How many columns and rows the picture is cut into. More cells is a finer animation and more work per frame."
            }
        >
            <div class={styles.valueList}>
                <PageNumberField
                    value={cellCount.col}
                    min={CellAnimationKnobs.MIN_CELL_COUNT}
                    max={CellAnimationKnobs.MAX_CELL_COUNT}
                    step={CellAnimationKnobs.CELL_COUNT_STEP}
                    ariaLabel={"Columns"}
                    onInput={(value) => {
                        cellCount = { ...cellCount, col: value };
                    }}
                />
                <PageNumberField
                    value={cellCount.row}
                    min={CellAnimationKnobs.MIN_CELL_COUNT}
                    max={CellAnimationKnobs.MAX_CELL_COUNT}
                    step={CellAnimationKnobs.CELL_COUNT_STEP}
                    ariaLabel={"Rows"}
                    onInput={(value) => {
                        cellCount = { ...cellCount, row: value };
                    }}
                />
            </div>
        </PageProp>

        <PageProp
            itemKey={"originType"}
            controls={"Picks the point the example's weights are measured from, sent to CellAnimationProps.computeCellWeights"}
            label={"Origin"}
            hint={
                "Where in the grid the animation starts from. It only applies to weights that are measured from a point."
            }
        >
            <PageSelectField
                value={originType}
                values={CellAnimationOrigins.ORIGIN_TYPES}
                isDisabled={!CellAnimationWeights.isOriginAware(weightType)}
                ariaLabel={"Origin"}
                onChange={(origin) => {
                    originType = origin;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"weightType"}
            controls={"Picks the example's weight function sent to CellAnimationProps.computeCellWeights"}
            label={"Weight"}
            hint={"How each cell's turn is decided: its distance from the origin, a wave, a random draw, and so on."}
        >
            <PageGroupedSelectField
                value={weightType}
                groups={GROUPPED_WEIGHTS}
                ariaLabel={"Weight"}
                onChange={(weight) => {
                    weightType = weight;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"uniqueWeights"}
            controls={"Sets WeightOpts.shouldMakeUnique"}
            label={"Unique weights"}
            hint={
                "Gives every cell a turn of its own, so no two move together even where the weight would have tied them."
            }
        >
            <PageCheckField
                value={!!weightOpts.shouldMakeUnique}
                ariaLabel={"Unique weights"}
                onChange={(value) => {
                    weightOpts = { ...weightOpts, shouldMakeUnique: value };
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"normalizeWeights"}
            controls={"Sets WeightOpts.shouldNormalize"}
            label={"Normalize weights"}
            hint={
                "Spreads the weights out to fill the whole run, so the first cell starts at the beginning and the last ends at the end."
            }
        >
            <PageCheckField
                value={!!weightOpts.shouldNormalize}
                ariaLabel={"Normalize weights"}
                onChange={(value) => {
                    weightOpts = { ...weightOpts, shouldNormalize: value };
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"animationType"}
            controls={"Picks the example's cell keyframes sent to CellAnimationProps.computeSliceAnimation"}
            label={"Animation"}
            hint={"What each cell actually does on its turn: fade, slide, spin, and the rest."}
        >
            <PageGroupedSelectField
                value={animationType}
                groups={GROUPPED_ANIMATIONS}
                ariaLabel={"Animation"}
                onChange={(anim) => {
                    animationType = anim;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"direction"}
            controls={"Sets CellAnimationBreakpointOpts.dir"}
            label={"Direction"}
            hint={"Which way the run travels through the weights, and so which cells go first."}
        >
            <PageSelectField
                value={breakpointOpts.dir!}
                values={CellAnimationBreakpoints.DIRECTIONS}
                ariaLabel={"Direction"}
                onChange={(dir) => {
                    breakpointOpts = { ...breakpointOpts, dir };
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"easing"}
            controls={"Sets CellAnimationBreakpointOpts.easing"}
            label={"Easing"}
            hint={"The speed curve a single cell follows from its start to its finish."}
        >
            <PageSelectField
                value={breakpointOpts.easing!}
                values={CellAnimationBreakpoints.EASINGS}
                ariaLabel={"Easing"}
                onChange={(easing) => {
                    breakpointOpts = { ...breakpointOpts, easing };
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"smoothness01"}
            controls={"Sets CellAnimationBreakpointOpts.smoothness"}
            label={"Smoothness (0-1)"}
            hint={
                "How much a cell's own movement overlaps its neighbors'. 0 makes each cell wait its turn; 1 blurs them into one sweep."
            }
        >
            <PageNumberField
                value={breakpointOpts.smoothness!}
                min={CellAnimationKnobs.MIN_SMOOTHNESS}
                max={CellAnimationKnobs.MAX_SMOOTHNESS}
                step={CellAnimationKnobs.SMOOTHNESS_STEP}
                ariaLabel={"Smoothness"}
                onInput={(value) => {
                    breakpointOpts = { ...breakpointOpts, smoothness: value };
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"animationDurationMs"}
            controls={"Sets CellAnimationProps.animationDurationMs"}
            label={"Animation duration (ms)"}
            hint={"How long one pass over the whole grid takes."}
        >
            <PageNumberField
                value={animationDurationMs}
                min={CellAnimationKnobs.MIN_DURATION_MS}
                max={CellAnimationKnobs.MAX_DURATION_MS}
                step={CellAnimationKnobs.DURATION_STEP_MS}
                ariaLabel={"Animation duration"}
                onInput={(value) => {
                    animationDurationMs = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"animationIterationDelayMs"}
            controls={"Sets CellAnimationProps.animationIterationDelayMs"}
            label={"Iteration delay (ms)"}
            hint={"How long the grid waits between one pass and the next."}
        >
            <PageNumberField
                value={animationIterationDelayMs}
                min={CellAnimationKnobs.MIN_ITERATION_DELAY_MS}
                max={CellAnimationKnobs.MAX_ITERATION_DELAY_MS}
                step={CellAnimationKnobs.DURATION_STEP_MS}
                ariaLabel={"Iteration delay"}
                onInput={(value) => {
                    animationIterationDelayMs = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"animationIterationCount"}
            controls={"Sets CellAnimationProps.animationIterationCount, with -1 sent as Infinity"}
            label={"Iteration count (-1 = endless)"}
            hint={"How many passes to run. -1 means it never stops, and 0 shows the final frame at once."}
        >
            <PageNumberField
                value={animationIterationCount}
                min={CellAnimationKnobs.MIN_ITERATION_COUNT}
                max={CellAnimationKnobs.MAX_ITERATION_COUNT}
                step={CellAnimationKnobs.CELL_COUNT_STEP}
                ariaLabel={"Iteration count"}
                onInput={(value) => {
                    animationIterationCount = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"finalFrame"}
            controls={"Sets CellAnimationProps.finalFrame"}
            label={"Final frame is"}
            hint={
                "What the grid is left showing once the passes are done. It has nothing to settle on while the run is endless."
            }
        >
            <PageSelectField
                value={finalFrame}
                values={CELL_ANIMATION_FINAL_FRAMES}
                isDisabled={animationIterationCount === CellAnimationKnobs.ENDLESS_ITERATION_COUNT}
                ariaLabel={"Final frame"}
                onChange={(frame) => {
                    finalFrame = frame;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"playbackDir"}
            controls={"Sets CellAnimationPlaybackOpts.dir"}
            label={"Playback direction"}
            hint={"Whether each pass runs one way, or goes out and comes back. Coming back, stack starts with the last cell to arrive and pipe with the first."}
        >
            <PageSelectField
                value={playbackOpts.dir!}
                values={CellAnimationPlayback.DIRECTIONS}
                ariaLabel={"Playback direction"}
                onChange={(dir) => {
                    playbackOpts = { ...playbackOpts, dir };
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"holdMs"}
            controls={"Sets CellAnimationPlaybackOpts.holdMs"}
            label={"Hold at far end (ms)"}
            hint={
                "How long the grid rests at the far end before turning back. It only applies to stack and pipe, which come back."
            }
        >
            <PageNumberField
                value={playbackOpts.holdMs!}
                min={CellAnimationKnobs.MIN_HOLD_MS}
                max={CellAnimationKnobs.MAX_HOLD_MS}
                step={CellAnimationKnobs.DURATION_STEP_MS}
                isDisabled={!CellAnimationPlaybackUtils.isRoundTrip(playbackOpts.dir)}
                ariaLabel={"Hold at far end"}
                onInput={(value) => {
                    playbackOpts = { ...playbackOpts, holdMs: value };
                }}
            />
        </PageProp>
        </PagePropsPanel>
    </PagePropsGroups>

    <PageExamples items={examples} layout={"flow"} />
</div>
