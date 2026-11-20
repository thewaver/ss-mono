<script lang="ts">
    import { CellAnimationKeyframes, CellAnimationOrigins, SliceAnimationWeights } from "@thewaver/ss-components-svelte";
    import { ParticleFieldKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleFields.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.css";
    import type { Count2d } from "@thewaver/ss-utils";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageGroupedSelectField from "../../PageComponents/Field/PageGroupedSelectField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import DefaultExampleWrapper from "./DefaultExampleWrapper.svelte";
    import type { ParticleFieldExampleProps } from "./ParticleFieldPage.types";
    import ShapedExampleWrapper from "./ShapedExampleWrapper.svelte";
    import StressTestWrapper from "./StressTestWrapper.svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    PERCENT,
} from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.const";

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
    let defaultPlayback = $state(true);
    let progress = $state(0);

    let spawnChance = $state(ParticleFieldKnobs.STARTING_SPAWN_CHANCE);
    let durationMs = $state(ParticleFieldKnobs.STARTING_DURATION_MS);
    let lifetimeMs = $state(ParticleFieldKnobs.STARTING_LIFETIME_MS);
    let iterationDelayMs = $state(ParticleFieldKnobs.STARTING_ITERATION_DELAY_MS);
    let holdShare = $state(ParticleFieldKnobs.STARTING_HOLD_SHARE);
    let isScattered = $state(ParticleFieldKnobs.STARTING_IS_SCATTERED);
    let originType = $state<CellAnimationOrigins.OriginType>(ParticleFieldKnobs.STARTING_ORIGIN_KEY);
    let weightType = $state<SliceAnimationWeights.WeightType>(ParticleFieldKnobs.STARTING_WEIGHT_KEY);
    let animationType = $state<CellAnimationKeyframes.AnimationType>(ParticleFieldKnobs.STARTING_ANIMATION_KEY);
    let cellCount = $state.raw<Count2d>({ ...ParticleFieldKnobs.STARTING_CELL_COUNT });

    const commonProps: Omit<ParticleFieldExampleProps, "playback"> = $derived({
        cellCount,
        spawnChance,
        animationIterationDelayMs: iterationDelayMs,
        animationDurationMs: durationMs,
        particleLifetimeMs: lifetimeMs,
        originType,
        weightType,
        animationType,
        holdShare,
        isScattered,
    });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () =>
                `${Math.round(progress * PERCENT)}% through the pass, ${defaultPlayback ? "running" : "stopped"} — the progress signal is written by the field while it plays, and writing it moves the pass there`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "shaped",
            name: EXAMPLE_NAMES.shaped,
            readout: () =>
                "the same field, limited to one of the built-in shapes Shape draws; a cell whose center falls outside it never spawns",
            component: shapedExample,
            path: `${EXAMPLES_ROOT}/Shaped.svelte`,
        },
        {
            key: "stressTest",
            name: EXAMPLE_NAMES.stressTest,
            component: stressTestExample,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExampleWrapper {...commonProps} bind:progress bind:ownPlayback={defaultPlayback} />
{/snippet}

{#snippet shapedExample()}
    <ShapedExampleWrapper {...commonProps} bind:playback />
{/snippet}

{#snippet stressTestExample()}
    <StressTestWrapper {...commonProps} bind:playback />
{/snippet}

<div class={styles.root}>
    <PagePropsPanel scope={"global"}>
        <PageProp
            itemKey={"spawnChance"}
            {...ParticleFieldKnobs.SPAWN_CHANCE_TEXT}
        >
            <PageNumberField
                value={spawnChance}
                min={ParticleFieldKnobs.MIN_SPAWN_CHANCE}
                max={ParticleFieldKnobs.MAX_SPAWN_CHANCE}
                step={ParticleFieldKnobs.SPAWN_CHANCE_STEP}
                ariaLabel={"Spawn chance"}
                onInput={(value) => {
                    spawnChance = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"cellCount"}
            {...ParticleFieldKnobs.CELL_COUNT_TEXT}
        >
            <div class={styles.valueList}>
                <PageNumberField
                    value={cellCount.colCount}
                    min={ParticleFieldKnobs.MIN_CELL_COUNT}
                    max={ParticleFieldKnobs.MAX_CELL_COUNT}
                    step={ParticleFieldKnobs.CELL_COUNT_STEP}
                    ariaLabel={"Columns"}
                    onInput={(value) => {
                        cellCount = { ...cellCount, colCount: value };
                    }}
                />
                <PageNumberField
                    value={cellCount.rowCount}
                    min={ParticleFieldKnobs.MIN_CELL_COUNT}
                    max={ParticleFieldKnobs.MAX_CELL_COUNT}
                    step={ParticleFieldKnobs.CELL_COUNT_STEP}
                    ariaLabel={"Rows"}
                    onInput={(value) => {
                        cellCount = { ...cellCount, rowCount: value };
                    }}
                />
            </div>
        </PageProp>

        <PageProp
            itemKey={"originType"}
            {...ParticleFieldKnobs.ORIGIN_TYPE_TEXT}
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
            {...ParticleFieldKnobs.WEIGHT_TYPE_TEXT}
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
            itemKey={"animationType"}
            {...ParticleFieldKnobs.ANIMATION_TYPE_TEXT}
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
            itemKey={"holdShare"}
            {...ParticleFieldKnobs.HOLD_SHARE_TEXT}
        >
            <PageNumberField
                value={holdShare}
                min={ParticleFieldKnobs.MIN_HOLD_SHARE}
                max={ParticleFieldKnobs.MAX_HOLD_SHARE}
                step={ParticleFieldKnobs.HOLD_SHARE_STEP}
                ariaLabel={"Hold share"}
                onInput={(value) => {
                    holdShare = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isScattered"}
            {...ParticleFieldKnobs.IS_SCATTERED_TEXT}
        >
            <PageCheckField
                value={isScattered}
                ariaLabel={"Scatter in cell"}
                onChange={(value) => {
                    isScattered = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"animationDurationMs"}
            {...ParticleFieldKnobs.ANIMATION_DURATION_MS_TEXT}
        >
            <PageNumberField
                value={durationMs}
                min={ParticleFieldKnobs.MIN_DURATION_MS}
                max={ParticleFieldKnobs.MAX_DURATION_MS}
                step={ParticleFieldKnobs.DURATION_STEP_MS}
                ariaLabel={"Duration"}
                onInput={(value) => {
                    durationMs = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"particleLifetimeMs"}
            {...ParticleFieldKnobs.PARTICLE_LIFETIME_MS_TEXT}
        >
            <PageNumberField
                value={lifetimeMs}
                min={ParticleFieldKnobs.MIN_LIFETIME_MS}
                max={ParticleFieldKnobs.MAX_LIFETIME_MS}
                step={ParticleFieldKnobs.DURATION_STEP_MS}
                ariaLabel={"Lifetime"}
                onInput={(value) => {
                    lifetimeMs = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"iterationDelayMs"}
            {...ParticleFieldKnobs.ITERATION_DELAY_MS_TEXT}
        >
            <PageNumberField
                value={iterationDelayMs}
                min={ParticleFieldKnobs.MIN_ITERATION_DELAY_MS}
                max={ParticleFieldKnobs.MAX_ITERATION_DELAY_MS}
                step={ParticleFieldKnobs.DURATION_STEP_MS}
                ariaLabel={"Iteration delay"}
                onInput={(value) => {
                    iterationDelayMs = value;
                }}
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples items={examples} layout={"flow"} />
</div>
