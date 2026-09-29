<script lang="ts">
    import {
        CELL_ANIMATION_DEFAULTS,
        CELL_ANIMATION_FINAL_FRAMES,
        CellAnimationBreakpoints,
        CellAnimationKeyframes,
        CellAnimationOrigins,
        CellAnimationPlayback,
        CellAnimationWeights,
    } from "@thewaver/ss-components-svelte";
    import type {
        CellAnimationBreakpointOpts,
        CellAnimationFinalFrame,
        CellAnimationPlaybackOpts,
        WeightOpts,
    } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";
    import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";
    import type { Index2d } from "@thewaver/ss-utils";

    import { CellAnimationKnobs } from "../../Knobs/CellAnimations.const";
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageGroupedSelectField from "../../PageComponents/Field/PageGroupedSelectField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import type { CellAnimationExampleProps } from "./CellAnimationPage.types";
    import WipeExample from "./Examples/Wipe.svelte";
    import GradientExampleWrapper from "./GradientExampleWrapper.svelte";
    import ImageExampleWrapper from "./ImageExampleWrapper.svelte";
    import PatternExampleWrapper from "./PatternExampleWrapper.svelte";
    import StressTestWrapper from "./StressTestWrapper.svelte";

    const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/CellAnimationPage/Examples/Default.svelte";
    const WIPE_EXAMPLE_PATH = "/src/App/Pages/CellAnimationPage/Examples/Wipe.svelte";
    const DRAWN_SOURCE_PATH = "/src/App/PageComponents/SVGDefsSources/SVGDefsSources.const.ts";

    const PERCENT = 100;

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
    let imagePlayback = $state(true);
    let imageProgress = $state(0);

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

    const examples: ExampleDefs[] = [
        {
            key: "image",
            name: "A photograph, sliced",
            readout: () =>
                `${Math.round(imageProgress * PERCENT)}% through the pass, ${imagePlayback ? "running" : "stopped"} — the progress signal is written by the component while it plays, and writing it moves the pass there`,
            component: imageExample,
            path: DEFAULT_EXAMPLE_PATH,
        },
        {
            key: "gradient",
            name: "A gradient, drawn in place",
            readout: () =>
                "the Shape page's own gradients, serialized into a source — the start and the pause a script would have timed are written into the markup instead, so they run at the same length and rhythm as the cells",
            component: gradientExample,
            path: DRAWN_SOURCE_PATH,
        },
        {
            key: "pattern",
            name: "A pattern, drawn in place",
            readout: () =>
                "the same for the patterns, which flow on without a pause — a repeating fill has no beat to be out of step with",
            component: patternExample,
            path: DRAWN_SOURCE_PATH,
        },
        {
            key: "wipe",
            name: "A screen wipe",
            readout: () =>
                "a solid-color picture fixed over the whole viewport, its cells growing in by the chosen weight and going back out after a hold; the lozenge is each cell turned 45° and grown past its box until it covers it, and there is no circle, since a cell can only be transformed and filtered, not reshaped",
            component: wipeExample,
            path: WIPE_EXAMPLE_PATH,
        },
        {
            key: "stressTest",
            name: "Stress Test",
            component: stressTestExample,
        },
    ];
</script>

{#snippet imageExample()}
    <ImageExampleWrapper {...commonProps} bind:playback={imagePlayback} bind:progress={imageProgress} />
{/snippet}

{#snippet gradientExample()}
    <GradientExampleWrapper {...commonProps} bind:playback />
{/snippet}

{#snippet patternExample()}
    <PatternExampleWrapper {...commonProps} bind:playback />
{/snippet}

{#snippet wipeExample()}
    <WipeExample {...commonProps} />
{/snippet}

{#snippet stressTestExample()}
    <StressTestWrapper {...commonProps} bind:playback src={knight_profile} />
{/snippet}

<div class={styles.root}>
    <PagePropsPanel scope={"global"}>
        <PageProp
            itemKey={"cellCountCols"}
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
            label={"Playback direction"}
            hint={"Whether each pass runs the same way as the last, or turns round and comes back."}
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
            label={"Hold at far end (ms)"}
            hint={
                "How long the grid rests at the far end before turning back. It only applies when the passes alternate."
            }
        >
            <PageNumberField
                value={playbackOpts.holdMs!}
                min={CellAnimationKnobs.MIN_HOLD_MS}
                max={CellAnimationKnobs.MAX_HOLD_MS}
                step={CellAnimationKnobs.DURATION_STEP_MS}
                isDisabled={!playbackOpts.dir?.startsWith("alternate")}
                ariaLabel={"Hold at far end"}
                onInput={(value) => {
                    playbackOpts = { ...playbackOpts, holdMs: value };
                }}
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples items={examples} layout={"flow"} />
</div>
