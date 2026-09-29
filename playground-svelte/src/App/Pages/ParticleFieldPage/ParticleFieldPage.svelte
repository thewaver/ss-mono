<script lang="ts">
    import { CellAnimationKeyframes, CellAnimationOrigins, CellAnimationWeights } from "@thewaver/ss-components-svelte";
    import { ParticleFieldKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleFields.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.css";
    import type { Index2d } from "@thewaver/ss-utils";

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

    const EXAMPLES_ROOT = "/src/App/Pages/ParticleFieldPage/Examples";
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
    let defaultPlayback = $state(true);
    let progress = $state(0);

    let spawnChance = $state(ParticleFieldKnobs.STARTING_SPAWN_CHANCE);
    let durationMs = $state(ParticleFieldKnobs.STARTING_DURATION_MS);
    let lifetimeMs = $state(ParticleFieldKnobs.STARTING_LIFETIME_MS);
    let iterationDelayMs = $state(ParticleFieldKnobs.STARTING_ITERATION_DELAY_MS);
    let holdShare = $state(ParticleFieldKnobs.STARTING_HOLD_SHARE);
    let isScattered = $state(ParticleFieldKnobs.STARTING_IS_SCATTERED);
    let originType = $state<CellAnimationOrigins.OriginType>(ParticleFieldKnobs.STARTING_ORIGIN_KEY);
    let weightType = $state<CellAnimationWeights.WeightType>(ParticleFieldKnobs.STARTING_WEIGHT_KEY);
    let animationType = $state<CellAnimationKeyframes.AnimationType>(ParticleFieldKnobs.STARTING_ANIMATION_KEY);
    let cellCount = $state.raw<Index2d>({ ...ParticleFieldKnobs.STARTING_CELL_COUNT });

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
            name: "The whole box",
            readout: () =>
                `${Math.round(progress * PERCENT)}% through the pass, ${defaultPlayback ? "running" : "stopped"} — the progress signal is written by the field while it plays, and writing it moves the pass there`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "shaped",
            name: "Inside a shape",
            readout: () =>
                "the same field, limited to one of the built-in shapes Shape draws; a cell whose center falls outside it never spawns",
            component: shapedExample,
            path: `${EXAMPLES_ROOT}/Shaped.svelte`,
        },
        {
            key: "stressTest",
            name: "Stress Test",
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
            label={"Spawn chance (0-1)"}
            hint={
                "The chance each cell spawns in a given pass. 1 spawns every cell every pass; lower leaves gaps that change from pass to pass. When a cell does spawn is still its weight's call."
            }
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
            label={"Cell count (cols x rows)"}
            hint={"How many columns and rows the field is split into. A cell holds one particle at a time."}
        >
            <div class={styles.valueList}>
                <PageNumberField
                    value={cellCount.col}
                    min={ParticleFieldKnobs.MIN_CELL_COUNT}
                    max={ParticleFieldKnobs.MAX_CELL_COUNT}
                    step={ParticleFieldKnobs.CELL_COUNT_STEP}
                    ariaLabel={"Columns"}
                    onInput={(value) => {
                        cellCount = { ...cellCount, col: value };
                    }}
                />
                <PageNumberField
                    value={cellCount.row}
                    min={ParticleFieldKnobs.MIN_CELL_COUNT}
                    max={ParticleFieldKnobs.MAX_CELL_COUNT}
                    step={ParticleFieldKnobs.CELL_COUNT_STEP}
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
                "Where in the grid the weights are measured from. It only applies to weights that are measured from a point."
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
            hint={"The same weights CellAnimation uses: a heavy cell spawns early in the pass and a light one late."}
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
            label={"Animation"}
            hint={
                "How a particle appears, played forwards as it arrives and backwards as it leaves: CellAnimation's own keyframes."
            }
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
            label={"Hold (0-1)"}
            hint={
                "How much of a particle's life it spends fully shown, between appearing and disappearing. 1 cuts in and out."
            }
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
            label={"Scatter in cell"}
            hint={
                "Places each particle at a random point in its cell rather than at the center, so the grid stops showing."
            }
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
            label={"Duration (ms)"}
            hint={
                "How long one pass over the grid takes, and so the shortest time between two spawns from the same cell."
            }
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
            label={"Lifetime (ms)"}
            hint={"How long one particle lives, from appearing to being removed."}
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
            label={"Iteration delay (ms)"}
            hint={"How long the field waits between one pass and the next."}
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
