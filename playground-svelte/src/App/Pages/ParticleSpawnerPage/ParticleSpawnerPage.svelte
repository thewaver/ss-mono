<script lang="ts">
    import { PARTICLE_SPAWNER_DEFAULTS } from "@thewaver/ss-components-svelte";
    import {
        ITERATION_PATTERNS,
        ITERATION_PATTERN_KEYS,
        TRAVEL_EASING_FNS,
        TRAVEL_EASING_KEYS,
        TRAVEL_PATTERN_FACTORIES,
        TRAVEL_PATTERN_KEYS,
        applyOvershoot,
    } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";

    import { ParticleSpawnerKnobs } from "../../Knobs/ParticleSpawners.const";
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageKnobs from "../../PageComponents/Knobs/Knobs.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsDivider from "../../PageComponents/PropsPanel/PagePropsDivider.svelte";
    import PagePropsGroups from "../../PageComponents/PropsPanel/PagePropsGroups.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import BurstExample from "./Examples/Burst.svelte";
    import DiagonalExample from "./Examples/Diagonal.svelte";
    import GridExample from "./Examples/Grid.svelte";
    import ManyToOneExample from "./Examples/ManyToOne.svelte";
    import MovingTargetExample from "./Examples/MovingTarget.svelte";
    import MultipleTargetsExample from "./Examples/MultipleTargets.svelte";
    import RadialExample from "./Examples/Radial.svelte";
    import RoundTripExample from "./Examples/RoundTrip.svelte";
    import SingleTargetExample from "./Examples/SingleTarget.svelte";
    import VerticalExample from "./Examples/Vertical.svelte";
    import type {
        IterationPattern,
        ParticleSpawnerExampleProps,
        ParticleTravelPattern,
        TravelEasingKey,
    } from "./ParticleSpawnerPage.types";
    import StressTestWrapper from "./StressTestWrapper.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/ParticleSpawnerPage/Examples";
    const FIELD_WIDTH = 130;
    const BOX_WIDTH = 420;
    const BOX_HEIGHT = 260;

    const NO_TRAVEL_DEFS: Record<string, number | boolean> = {};

    let particleCount = $state(ParticleSpawnerKnobs.STARTING_PARTICLE_COUNT);
    let travelDurationMs = $state(PARTICLE_SPAWNER_DEFAULTS.travelDurationMs);
    let retentionMs = $state(PARTICLE_SPAWNER_DEFAULTS.retentionMs);
    let spawnDelayMs = $state(ParticleSpawnerKnobs.STARTING_SPAWN_DELAY_MS);
    let overshootPercent = $state(ParticleSpawnerKnobs.STARTING_OVERSHOOT_PERCENT);
    let travelEasingKey = $state<TravelEasingKey>(ParticleSpawnerKnobs.STARTING_TRAVEL_EASING_KEY);

    let travelPatternKey = $state<ParticleTravelPattern>(ParticleSpawnerKnobs.STARTING_TRAVEL_PATTERN_KEY);

    let iterationPatternKey = $state<IterationPattern>(ParticleSpawnerKnobs.STARTING_ITERATION_PATTERN_KEY);

    let areTargetsHidden = $state(ParticleSpawnerKnobs.STARTING_ARE_TARGETS_HIDDEN);

    let travelDefs = $state.raw<Record<string, Record<string, number | boolean>>>({});
    let playback = $state(true);

    const travelKnobs = $derived(ParticleSpawnerKnobs.TRAVEL_KNOBS_BY_PATTERN[travelPatternKey]);
    const travelDefaults = $derived(ParticleSpawnerKnobs.TRAVEL_DEFAULTS_BY_PATTERN[travelPatternKey]);
    const pickedTravelDefs = $derived(travelDefs[travelPatternKey] ?? NO_TRAVEL_DEFS);

    const computeParticlePos = $derived.by(() => {
        const evaluate = TRAVEL_PATTERN_FACTORIES[travelPatternKey]({
            ...travelDefaults,
            ...pickedTravelDefs,
        } as Record<string, number>);
        const easingFn = TRAVEL_EASING_FNS[travelEasingKey];
        const overshoot = overshootPercent;

        return (defs: Parameters<typeof evaluate>[0], t: number) =>
            evaluate(defs, applyOvershoot(t, easingFn(t), overshoot));
    });

    const spawnIterationPatterns = $derived(ITERATION_PATTERNS[iterationPatternKey]());

    const commonProps: Omit<ParticleSpawnerExampleProps, "playback"> = $derived({
        particleCount,
        travelDurationMs,
        retentionMs,
        spawnDelayMs,
        spawnIterationPatterns,
        computeParticlePos,
        areTargetsHidden,
    });

    const examples: ExampleDefs[] = [
        {
            key: "singleTarget",
            name: "Single target",
            component: singleTargetExample,
            path: `${EXAMPLES_ROOT}/SingleTarget.svelte`,
        },
        {
            key: "vertical",
            name: "Vertical",
            component: verticalExample,
            path: `${EXAMPLES_ROOT}/Vertical.svelte`,
        },
        {
            key: "diagonal",
            name: "Diagonal",
            component: diagonalExample,
            path: `${EXAMPLES_ROOT}/Diagonal.svelte`,
        },
        {
            key: "movingTarget",
            name: "Moving target",
            component: movingTargetExample,
            path: `${EXAMPLES_ROOT}/MovingTarget.svelte`,
        },
        {
            key: "radial",
            name: "Radial (1 spawner, many targets)",
            component: radialExample,
            path: `${EXAMPLES_ROOT}/Radial.svelte`,
        },
        {
            key: "manyToOne",
            name: "Many to one (many spawners, 1 target)",
            component: manyToOneExample,
            path: `${EXAMPLES_ROOT}/ManyToOne.svelte`,
        },
        {
            key: "burst",
            name: "Burst on press",
            component: burstExample,
            path: `${EXAMPLES_ROOT}/Burst.svelte`,
        },
        {
            key: "roundTrip",
            name: "Round trip (a relay on arrival)",
            component: roundTripExample,
            path: `${EXAMPLES_ROOT}/RoundTrip.svelte`,
        },
        {
            key: "multipleTargets",
            name: "Multiple targets",
            component: multipleTargetsExample,
            path: `${EXAMPLES_ROOT}/MultipleTargets.svelte`,
        },
        {
            key: "grid",
            name: "N spawners x M targets",
            component: gridExample,
            path: `${EXAMPLES_ROOT}/Grid.svelte`,
        },
        {
            key: "stressTest",
            name: "Stress Test",
            component: stressTestExample,
        },
    ];
</script>

{#snippet singleTargetExample()}
    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
        <SingleTargetExample {...commonProps} bind:playback />
    </PageMeasureBox>
{/snippet}

{#snippet verticalExample()}
    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
        <VerticalExample {...commonProps} bind:playback />
    </PageMeasureBox>
{/snippet}

{#snippet diagonalExample()}
    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
        <DiagonalExample {...commonProps} bind:playback />
    </PageMeasureBox>
{/snippet}

{#snippet movingTargetExample()}
    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
        <MovingTargetExample {...commonProps} bind:playback />
    </PageMeasureBox>
{/snippet}

{#snippet radialExample()}
    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
        <RadialExample {...commonProps} bind:playback />
    </PageMeasureBox>
{/snippet}

{#snippet manyToOneExample()}
    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
        <ManyToOneExample {...commonProps} bind:playback />
    </PageMeasureBox>
{/snippet}

{#snippet burstExample()}
    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
        <BurstExample {...commonProps} {playback} />
    </PageMeasureBox>
{/snippet}

{#snippet roundTripExample()}
    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
        <RoundTripExample {...commonProps} bind:playback />
    </PageMeasureBox>
{/snippet}

{#snippet multipleTargetsExample()}
    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
        <MultipleTargetsExample {...commonProps} bind:playback />
    </PageMeasureBox>
{/snippet}

{#snippet gridExample()}
    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
        <GridExample {...commonProps} bind:playback />
    </PageMeasureBox>
{/snippet}

{#snippet stressTestExample()}
    <StressTestWrapper {...commonProps} bind:playback />
{/snippet}

<PagePropsGroups>
    <PagePropsPanel scope={"sample"}>
        <PageProp
            itemKey={"travelPattern"}
            label={"Travel pattern"}
            hint={"The path a particle takes from where it starts to where it ends. Choosing one brings its own knobs with it."}
        >
            <PageSelectField
                value={travelPatternKey}
                values={TRAVEL_PATTERN_KEYS}
                width={FIELD_WIDTH}
                ariaLabel={"Travel pattern"}
                onChange={(key) => (travelPatternKey = key)}
            />
        </PageProp>

        <PageKnobs
            knobs={travelKnobs}
            defaults={travelDefaults}
            values={pickedTravelDefs}
            width={FIELD_WIDTH}
            onInput={(key, value) =>
                (travelDefs = {
                    ...travelDefs,
                    [travelPatternKey]: { ...travelDefs[travelPatternKey], [key]: value },
                })}
        />
    </PagePropsPanel>

    <PagePropsDivider />

    <PagePropsPanel scope={"global"}>
        <PageProp
            itemKey={"particleCount"}
            label={"Particle count"}
            hint={"How many particles are sent on each round."}
        >
            <PageNumberField
                value={particleCount}
                min={ParticleSpawnerKnobs.MIN_PARTICLE_COUNT}
                max={ParticleSpawnerKnobs.MAX_PARTICLE_COUNT}
                step={ParticleSpawnerKnobs.PARTICLE_COUNT_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Particle count"}
                onInput={(value) => (particleCount = value)}
            />
        </PageProp>

        <PageProp
            itemKey={"travelDurationMs"}
            label={"Travel (ms)"}
            hint={"How long one particle takes to walk its path."}
        >
            <PageNumberField
                value={travelDurationMs}
                min={ParticleSpawnerKnobs.MIN_TRAVEL_DURATION_MS}
                max={ParticleSpawnerKnobs.MAX_TRAVEL_DURATION_MS}
                step={ParticleSpawnerKnobs.TRAVEL_DURATION_STEP_MS}
                width={FIELD_WIDTH}
                ariaLabel={"Travel duration in milliseconds"}
                onInput={(value) => (travelDurationMs = value)}
            />
        </PageProp>

        <PageProp
            itemKey={"retentionMs"}
            label={"Retention (ms)"}
            hint={"How long a particle stays put at the end of its path before it disappears."}
        >
            <PageNumberField
                value={retentionMs}
                min={ParticleSpawnerKnobs.MIN_RETENTION_MS}
                max={ParticleSpawnerKnobs.MAX_RETENTION_MS}
                step={ParticleSpawnerKnobs.RETENTION_STEP_MS}
                width={FIELD_WIDTH}
                ariaLabel={"Retention in milliseconds"}
                onInput={(value) => (retentionMs = value)}
            />
        </PageProp>

        <PageProp
            itemKey={"spawnDelayMs"}
            label={"Spawn delay (ms)"}
            hint={"How long each particle waits after the one before it sets off, which is what staggers them."}
        >
            <PageNumberField
                value={spawnDelayMs}
                min={ParticleSpawnerKnobs.MIN_SPAWN_DELAY_MS}
                max={ParticleSpawnerKnobs.MAX_SPAWN_DELAY_MS}
                step={ParticleSpawnerKnobs.SPAWN_DELAY_STEP_MS}
                width={FIELD_WIDTH}
                ariaLabel={"Spawn delay in milliseconds"}
                onInput={(value) => (spawnDelayMs = value)}
            />
        </PageProp>

        <PageProp
            itemKey={"iterationPattern"}
            label={"Iteration pattern"}
            hint={"How the rounds follow each other: in bursts of three with a pause, one at a time with a pause, or without any pause at all."}
        >
            <PageSelectField
                value={iterationPatternKey}
                values={ITERATION_PATTERN_KEYS}
                width={FIELD_WIDTH}
                ariaLabel={"Iteration pattern"}
                onChange={(key) => (iterationPatternKey = key)}
            />
        </PageProp>

        <PageProp
            itemKey={"overshootPercent"}
            label={"Overshoot (%)"}
            hint={"How far a particle runs past its destination before coming back to it. 0 stops it dead on target."}
        >
            <PageNumberField
                value={overshootPercent}
                min={ParticleSpawnerKnobs.MIN_OVERSHOOT_PERCENT}
                max={ParticleSpawnerKnobs.MAX_OVERSHOOT_PERCENT}
                step={ParticleSpawnerKnobs.OVERSHOOT_PERCENT_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Overshoot percent"}
                onInput={(value) => (overshootPercent = value)}
            />
        </PageProp>

        <PageProp
            itemKey={"areTargetsHidden"}
            label={"Hide targets"}
            hint={"Takes the target markers out of sight while leaving them where they are, so the particles still land on them."}
        >
            <PageCheckField
                value={areTargetsHidden}
                ariaLabel={"Hide targets"}
                onChange={(value) => (areTargetsHidden = value)}
            />
        </PageProp>

        <PageProp
            itemKey={"travelEasing"}
            label={"Travel easing"}
            hint={"The speed curve a particle follows along its path."}
        >
            <PageSelectField
                value={travelEasingKey}
                values={TRAVEL_EASING_KEYS}
                width={FIELD_WIDTH}
                ariaLabel={"Travel easing"}
                onChange={(key) => (travelEasingKey = key)}
            />
        </PageProp>
    </PagePropsPanel>
</PagePropsGroups>

<PageExamples items={examples} layout={"flow"} />
