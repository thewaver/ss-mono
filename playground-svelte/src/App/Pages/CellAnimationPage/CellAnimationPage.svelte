<script lang="ts">
    import {
        CELL_ANIMATION_DEFAULTS,
        CELL_ANIMATION_FINAL_FRAMES,
        SliceAnimationBreakpoints,
        CellAnimationKeyframes,
        CellAnimationOrigins,
        SliceAnimationPlayback,
        SliceAnimationPlaybackUtils,
        SliceAnimationWeights,
    } from "@thewaver/ss-components-svelte";
    import type {
        SVGDefsSamples,
        SliceAnimationBreakpointOpts,
        CellAnimationFinalFrame,
        SliceAnimationPlaybackOpts,
        WeightOpts,
    } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";
    import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";
    import type { CellAnimationSourceKind } from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.types";
    import type { Count2d, Size2d } from "@thewaver/ss-utils";

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

    const GROUPPED_WEIGHTS = groupOptions(SliceAnimationWeights.WEIGHT_TYPES);
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
    let weightType = $state<SliceAnimationWeights.WeightType>(CellAnimationKnobs.STARTING_WEIGHT_KEY);
    let animationType = $state<CellAnimationKeyframes.AnimationType>(CellAnimationKnobs.STARTING_ANIMATION_KEY);
    let animationDurationMs = $state(CELL_ANIMATION_DEFAULTS.animationDurationMs);
    let animationIterationDelayMs = $state(CELL_ANIMATION_DEFAULTS.animationIterationDelayMs);
    let animationIterationCount = $state(CellAnimationKnobs.ENDLESS_ITERATION_COUNT);
    let finalFrame = $state<CellAnimationFinalFrame>(CELL_ANIMATION_DEFAULTS.finalFrame);
    let cellCount = $state.raw<Count2d>({ ...CellAnimationKnobs.STARTING_CELL_COUNT });
    let weightOpts = $state.raw<WeightOpts>({ ...CellAnimationKnobs.STARTING_WEIGHT_OPTS });
    let breakpointOpts = $state.raw<SliceAnimationBreakpointOpts>({ ...CellAnimationKnobs.STARTING_BREAKPOINT_OPTS });
    let playbackOpts = $state.raw<SliceAnimationPlaybackOpts>({ ...CellAnimationKnobs.STARTING_PLAYBACK_OPTS });

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
        SliceAnimationPlaybackUtils.computeCycleDurationMs(animationDurationMs, playbackOpts),
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
                {...CellAnimationKnobs.SOURCE_KIND_TEXT}
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
                    {...CellAnimationKnobs.IMAGE_TEXT}
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
                    {...CellAnimationKnobs.GRADIENT_TEXT}
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
                    {...CellAnimationKnobs.PATTERN_TEXT}
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
                    {...CellAnimationKnobs.SOURCE_RATIO_TEXT}
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
            {...CellAnimationKnobs.CELL_COUNT_COLS_TEXT}
        >
            <div class={styles.valueList}>
                <PageNumberField
                    value={cellCount.colCount}
                    min={CellAnimationKnobs.MIN_CELL_COUNT}
                    max={CellAnimationKnobs.MAX_CELL_COUNT}
                    step={CellAnimationKnobs.CELL_COUNT_STEP}
                    ariaLabel={"Columns"}
                    onInput={(value) => {
                        cellCount = { ...cellCount, colCount: value };
                    }}
                />
                <PageNumberField
                    value={cellCount.rowCount}
                    min={CellAnimationKnobs.MIN_CELL_COUNT}
                    max={CellAnimationKnobs.MAX_CELL_COUNT}
                    step={CellAnimationKnobs.CELL_COUNT_STEP}
                    ariaLabel={"Rows"}
                    onInput={(value) => {
                        cellCount = { ...cellCount, rowCount: value };
                    }}
                />
            </div>
        </PageProp>

        <PageProp
            itemKey={"originType"}
            {...CellAnimationKnobs.ORIGIN_TYPE_TEXT}
        >
            <PageSelectField
                value={originType}
                values={CellAnimationOrigins.ORIGIN_TYPES}
                isDisabled={!SliceAnimationWeights.isOriginAware(weightType)}
                ariaLabel={"Origin"}
                onChange={(origin) => {
                    originType = origin;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"weightType"}
            {...CellAnimationKnobs.WEIGHT_TYPE_TEXT}
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
            {...CellAnimationKnobs.UNIQUE_WEIGHTS_TEXT}
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
            {...CellAnimationKnobs.NORMALIZE_WEIGHTS_TEXT}
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
            {...CellAnimationKnobs.ANIMATION_TYPE_TEXT}
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
            {...CellAnimationKnobs.DIRECTION_TEXT}
        >
            <PageSelectField
                value={breakpointOpts.dir!}
                values={SliceAnimationBreakpoints.DIRECTIONS}
                ariaLabel={"Direction"}
                onChange={(dir) => {
                    breakpointOpts = { ...breakpointOpts, dir };
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"easing"}
            {...CellAnimationKnobs.EASING_TEXT}
        >
            <PageSelectField
                value={breakpointOpts.easing!}
                values={SliceAnimationBreakpoints.EASINGS}
                ariaLabel={"Easing"}
                onChange={(easing) => {
                    breakpointOpts = { ...breakpointOpts, easing };
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"smoothness01"}
            {...CellAnimationKnobs.SMOOTHNESS01_TEXT}
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
            {...CellAnimationKnobs.ANIMATION_DURATION_MS_TEXT}
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
            {...CellAnimationKnobs.ANIMATION_ITERATION_DELAY_MS_TEXT}
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
            {...CellAnimationKnobs.ANIMATION_ITERATION_COUNT_TEXT}
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
            {...CellAnimationKnobs.FINAL_FRAME_TEXT}
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
            {...CellAnimationKnobs.PLAYBACK_DIR_TEXT}
        >
            <PageSelectField
                value={playbackOpts.dir!}
                values={SliceAnimationPlayback.DIRECTIONS}
                ariaLabel={"Playback direction"}
                onChange={(dir) => {
                    playbackOpts = { ...playbackOpts, dir };
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"holdMs"}
            {...CellAnimationKnobs.HOLD_MS_TEXT}
        >
            <PageNumberField
                value={playbackOpts.holdMs!}
                min={CellAnimationKnobs.MIN_HOLD_MS}
                max={CellAnimationKnobs.MAX_HOLD_MS}
                step={CellAnimationKnobs.DURATION_STEP_MS}
                isDisabled={!SliceAnimationPlaybackUtils.isRoundTrip(playbackOpts.dir)}
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
