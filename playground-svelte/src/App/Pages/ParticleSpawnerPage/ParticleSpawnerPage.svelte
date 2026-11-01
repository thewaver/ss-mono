<script lang="ts">
    import { EXAMPLES_ONLY_PROP } from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.const";
    import { PARTICLE_SPAWNER_DEFAULTS, ParticleIterationPatterns, ParticleTravelEasings, ParticleTravelPaths, type ParticleIterationPatternType, type ParticleTravelEasingType, type ParticleTravelPathType } from "@thewaver/ss-components-svelte";
    import { EXAMPLE_NAMES, EXAMPLES_ROOT, FIELD_WIDTH, NO_TRAVEL_DEFS } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";

    import { ParticleSpawnerKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleSpawners.const";
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageKnobs from "../../PageComponents/Knobs/Knobs.svelte";
    import { PlaybackScrubberUtils } from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.utils.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsDivider from "../../PageComponents/PropsPanel/PagePropsDivider.svelte";
    import PagePropsGroups from "../../PageComponents/PropsPanel/PagePropsGroups.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import AttractionExampleWrapper from "./AttractionExampleWrapper.svelte";
    import DiagonalExample from "./Examples/Diagonal.svelte";
    import GridExample from "./Examples/Grid.svelte";
    import ManyToOneExample from "./Examples/ManyToOne.svelte";
    import MovingTargetExample from "./Examples/MovingTarget.svelte";
    import MultipleTargetsExample from "./Examples/MultipleTargets.svelte";
    import RadialExample from "./Examples/Radial.svelte";
    import RoundTripExample from "./Examples/RoundTrip.svelte";
    import SingleTargetExample from "./Examples/SingleTarget.svelte";
    import VerticalExample from "./Examples/Vertical.svelte";
    import type { PlaybackSlot } from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.types";
    import type { ParticleSpawnerExampleProps, ProgressSlot } from "./ParticleSpawnerPage.types";
    import ScrubbedExampleWrapper from "./ScrubbedExampleWrapper.svelte";
    import StressTestWrapper from "./StressTestWrapper.svelte";
    import WindExampleWrapper from "./WindExampleWrapper.svelte";

    let particleCount = $state(ParticleSpawnerKnobs.STARTING_PARTICLE_COUNT);
    let travelDurationMs = $state(PARTICLE_SPAWNER_DEFAULTS.travelDurationMs);
    let restDurationMs = $state(PARTICLE_SPAWNER_DEFAULTS.restDurationMs);
    let spawnDelayMs = $state(ParticleSpawnerKnobs.STARTING_SPAWN_DELAY_MS);
    let overshootPercent = $state(ParticleSpawnerKnobs.STARTING_OVERSHOOT_PERCENT);
    let travelEasingKey = $state<ParticleTravelEasingType>(ParticleSpawnerKnobs.STARTING_TRAVEL_EASING_KEY);

    let travelPatternKey = $state<ParticleTravelPathType>(ParticleSpawnerKnobs.STARTING_TRAVEL_PATTERN_KEY);

    let iterationPatternKey = $state<ParticleIterationPatternType>(ParticleSpawnerKnobs.STARTING_ITERATION_PATTERN_KEY);

    let areTargetsHidden = $state(ParticleSpawnerKnobs.STARTING_ARE_TARGETS_HIDDEN);

    let travelDefs = $state.raw<Record<string, Record<string, number | boolean>>>({});
    let playback = $state(true);
    const takePlayback = PlaybackScrubberUtils.createGroup("singleTarget");

    const travelKnobs = $derived(ParticleSpawnerKnobs.TRAVEL_KNOBS_BY_PATTERN[travelPatternKey]);
    const travelDefaults = $derived(ParticleTravelPaths.DEFAULT_OPTS[travelPatternKey]);
    const pickedTravelDefs = $derived(travelDefs[travelPatternKey] ?? NO_TRAVEL_DEFS);

    const computeParticlePos = $derived.by(() => {
        const evaluate = ParticleTravelPaths.SAMPLE_PATHS[travelPatternKey]({
            ...travelDefaults,
            ...pickedTravelDefs,
        } as Record<string, number>);
        const easingFn = ParticleTravelEasings.SAMPLE_EASINGS[travelEasingKey];
        const overshoot = overshootPercent;

        return (defs: Parameters<typeof evaluate>[0], t: number) =>
            evaluate(defs, ParticleTravelEasings.applyOvershoot(t, easingFn(t), overshoot));
    });

    const spawnIterationPatterns = $derived(ParticleIterationPatterns.SAMPLE_PATTERNS[iterationPatternKey]);

    const commonProps: Omit<ParticleSpawnerExampleProps, "playback"> = $derived({
        particleCount,
        travelDurationMs,
        restDurationMs,
        spawnDelayMs,
        spawnIterationPatterns,
        computeParticlePos,
        areTargetsHidden,
    });

    const examples: ExampleDefs[] = [
        {
            key: "singleTarget",
            name: EXAMPLE_NAMES.singleTarget,
            component: singleTargetExample,
            path: `${EXAMPLES_ROOT}/SingleTarget.svelte`,
        },
        {
            key: "vertical",
            name: EXAMPLE_NAMES.vertical,
            component: verticalExample,
            path: `${EXAMPLES_ROOT}/Vertical.svelte`,
        },
        {
            key: "diagonal",
            name: EXAMPLE_NAMES.diagonal,
            component: diagonalExample,
            path: `${EXAMPLES_ROOT}/Diagonal.svelte`,
        },
        {
            key: "movingTarget",
            name: EXAMPLE_NAMES.movingTarget,
            component: movingTargetExample,
            path: `${EXAMPLES_ROOT}/MovingTarget.svelte`,
        },
        {
            key: "radial",
            name: EXAMPLE_NAMES.radial,
            component: radialExample,
            path: `${EXAMPLES_ROOT}/Radial.svelte`,
        },
        {
            key: "manyToOne",
            name: EXAMPLE_NAMES.manyToOne,
            component: manyToOneExample,
            path: `${EXAMPLES_ROOT}/ManyToOne.svelte`,
        },
        {
            key: "roundTrip",
            name: EXAMPLE_NAMES.roundTrip,
            component: roundTripExample,
            path: `${EXAMPLES_ROOT}/RoundTrip.svelte`,
        },
        {
            key: "wind",
            name: EXAMPLE_NAMES.wind,
            component: windExample,
            path: `${EXAMPLES_ROOT}/Wind.svelte`,
        },
        {
            key: "attraction",
            name: EXAMPLE_NAMES.attraction,
            component: attractionExample,
            path: `${EXAMPLES_ROOT}/Attraction.svelte`,
        },
        {
            key: "multipleTargets",
            name: EXAMPLE_NAMES.multipleTargets,
            component: multipleTargetsExample,
            path: `${EXAMPLES_ROOT}/MultipleTargets.svelte`,
        },
        {
            key: "grid",
            name: EXAMPLE_NAMES.grid,
            component: gridExample,
            path: `${EXAMPLES_ROOT}/Grid.svelte`,
        },
        {
            key: "stressTest",
            name: EXAMPLE_NAMES.stressTest,
            component: stressTestExample,
        },
    ];
</script>

{#snippet singleTargetExample()}
    {@const groupPlayback = takePlayback("singleTarget")}
    {#snippet renderSingleTarget(examplePlayback: PlaybackSlot, progress: ProgressSlot)}
        <SingleTargetExample
            {...commonProps}
            bind:playback={() => examplePlayback.value, (next) => (examplePlayback.value = next)}
            bind:progress={() => progress.value, (next) => (progress.value = next)}
        />
    {/snippet}
    <ScrubbedExampleWrapper
        id={"singleTarget"}
        isPagePlaying={playback}
        bind:playback={() => groupPlayback.value, (next) => (groupPlayback.value = next)}
        renderExample={renderSingleTarget}
    />
{/snippet}

{#snippet verticalExample()}
    {@const groupPlayback = takePlayback("vertical")}
    {#snippet renderVertical(examplePlayback: PlaybackSlot, progress: ProgressSlot)}
        <VerticalExample
            {...commonProps}
            bind:playback={() => examplePlayback.value, (next) => (examplePlayback.value = next)}
            bind:progress={() => progress.value, (next) => (progress.value = next)}
        />
    {/snippet}
    <ScrubbedExampleWrapper
        id={"vertical"}
        isPagePlaying={playback}
        bind:playback={() => groupPlayback.value, (next) => (groupPlayback.value = next)}
        renderExample={renderVertical}
    />
{/snippet}

{#snippet diagonalExample()}
    {@const groupPlayback = takePlayback("diagonal")}
    {#snippet renderDiagonal(examplePlayback: PlaybackSlot, progress: ProgressSlot)}
        <DiagonalExample
            {...commonProps}
            bind:playback={() => examplePlayback.value, (next) => (examplePlayback.value = next)}
            bind:progress={() => progress.value, (next) => (progress.value = next)}
        />
    {/snippet}
    <ScrubbedExampleWrapper
        id={"diagonal"}
        isPagePlaying={playback}
        bind:playback={() => groupPlayback.value, (next) => (groupPlayback.value = next)}
        renderExample={renderDiagonal}
    />
{/snippet}

{#snippet movingTargetExample()}
    {@const groupPlayback = takePlayback("movingTarget")}
    {#snippet renderMovingTarget(examplePlayback: PlaybackSlot, progress: ProgressSlot)}
        <MovingTargetExample
            {...commonProps}
            bind:playback={() => examplePlayback.value, (next) => (examplePlayback.value = next)}
            bind:progress={() => progress.value, (next) => (progress.value = next)}
        />
    {/snippet}
    <ScrubbedExampleWrapper
        id={"movingTarget"}
        isPagePlaying={playback}
        bind:playback={() => groupPlayback.value, (next) => (groupPlayback.value = next)}
        renderExample={renderMovingTarget}
    />
{/snippet}

{#snippet radialExample()}
    {@const groupPlayback = takePlayback("radial")}
    {#snippet renderRadial(examplePlayback: PlaybackSlot, progress: ProgressSlot)}
        <RadialExample
            {...commonProps}
            bind:playback={() => examplePlayback.value, (next) => (examplePlayback.value = next)}
            bind:progress={() => progress.value, (next) => (progress.value = next)}
        />
    {/snippet}
    <ScrubbedExampleWrapper
        id={"radial"}
        isPagePlaying={playback}
        bind:playback={() => groupPlayback.value, (next) => (groupPlayback.value = next)}
        renderExample={renderRadial}
    />
{/snippet}

{#snippet manyToOneExample()}
    {@const groupPlayback = takePlayback("manyToOne")}
    {#snippet renderManyToOne(examplePlayback: PlaybackSlot, progress: ProgressSlot, takeProgress: () => ProgressSlot)}
        <ManyToOneExample
            {...commonProps}
            bind:playback={() => examplePlayback.value, (next) => (examplePlayback.value = next)}
            bind:progress={() => progress.value, (next) => (progress.value = next)}
            {takeProgress}
        />
    {/snippet}
    <ScrubbedExampleWrapper
        id={"manyToOne"}
        isPagePlaying={playback}
        bind:playback={() => groupPlayback.value, (next) => (groupPlayback.value = next)}
        renderExample={renderManyToOne}
    />
{/snippet}

{#snippet roundTripExample()}
    {@const groupPlayback = takePlayback("roundTrip")}
    {#snippet renderRoundTrip(examplePlayback: PlaybackSlot, progress: ProgressSlot)}
        <RoundTripExample
            {...commonProps}
            bind:playback={() => examplePlayback.value, (next) => (examplePlayback.value = next)}
            bind:progress={() => progress.value, (next) => (progress.value = next)}
        />
    {/snippet}
    <ScrubbedExampleWrapper
        id={"roundTrip"}
        isPagePlaying={playback}
        bind:playback={() => groupPlayback.value, (next) => (groupPlayback.value = next)}
        renderExample={renderRoundTrip}
    />
{/snippet}

{#snippet multipleTargetsExample()}
    {@const groupPlayback = takePlayback("multipleTargets")}
    {#snippet renderMultipleTargets(examplePlayback: PlaybackSlot, progress: ProgressSlot)}
        <MultipleTargetsExample
            {...commonProps}
            bind:playback={() => examplePlayback.value, (next) => (examplePlayback.value = next)}
            bind:progress={() => progress.value, (next) => (progress.value = next)}
        />
    {/snippet}
    <ScrubbedExampleWrapper
        id={"multipleTargets"}
        isPagePlaying={playback}
        bind:playback={() => groupPlayback.value, (next) => (groupPlayback.value = next)}
        renderExample={renderMultipleTargets}
    />
{/snippet}

{#snippet gridExample()}
    {@const groupPlayback = takePlayback("grid")}
    {#snippet renderGrid(examplePlayback: PlaybackSlot, progress: ProgressSlot, takeProgress: () => ProgressSlot)}
        <GridExample
            {...commonProps}
            bind:playback={() => examplePlayback.value, (next) => (examplePlayback.value = next)}
            bind:progress={() => progress.value, (next) => (progress.value = next)}
            {takeProgress}
        />
    {/snippet}
    <ScrubbedExampleWrapper
        id={"grid"}
        isPagePlaying={playback}
        bind:playback={() => groupPlayback.value, (next) => (groupPlayback.value = next)}
        renderExample={renderGrid}
    />
{/snippet}

{#snippet windExample()}
    {@const windPlayback = takePlayback("wind")}
    <WindExampleWrapper
        exampleProps={commonProps}
        isPagePlaying={playback}
        bind:playback={() => windPlayback.value, (next) => (windPlayback.value = next)}
    />
{/snippet}
{#snippet attractionExample()}
    {@const attractionPlayback = takePlayback("attraction")}
    <AttractionExampleWrapper
        exampleProps={commonProps}
        isPagePlaying={playback}
        bind:playback={() => attractionPlayback.value, (next) => (attractionPlayback.value = next)}
    />
{/snippet}
{#snippet stressTestExample()}
    <StressTestWrapper {...commonProps} bind:playback />
{/snippet}

<PagePropsGroups>
    <PagePropsPanel scope={"sample"}>
        <PageProp
            itemKey={"travelPattern"}
            controls={"Picks the example's travel path function sent to ParticleSpawnerProps.computeParticlePos"}
            label={"Travel pattern"}
            hint={"The path a particle takes from where it starts to where it ends. Choosing one brings its own knobs with it."}
        >
            <PageSelectField
                value={travelPatternKey}
                values={ParticleTravelPaths.PATH_TYPES}
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
            controls={"Sets ParticleSpawnerProps.particleCount"}
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
            controls={"Sets ParticleSpawnerProps.travelDurationMs"}
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
            itemKey={"restDurationMs"}
            controls={"Sets ParticleSpawnerProps.restDurationMs"}
            label={"Rest duration (ms)"}
            hint={"How long a particle stays put at the end of its path before it disappears."}
        >
            <PageNumberField
                value={restDurationMs}
                min={ParticleSpawnerKnobs.MIN_RETENTION_MS}
                max={ParticleSpawnerKnobs.MAX_RETENTION_MS}
                step={ParticleSpawnerKnobs.RETENTION_STEP_MS}
                width={FIELD_WIDTH}
                ariaLabel={"Rest duration in milliseconds"}
                onInput={(value) => (restDurationMs = value)}
            />
        </PageProp>

        <PageProp
            itemKey={"spawnDelayMs"}
            controls={"Sets ParticleSpawnerProps.spawnDelayMs"}
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
            controls={"Picks the example's list of rounds sent to ParticleSpawnerProps.spawnIterationPatterns"}
            label={"Iteration pattern"}
            hint={"How the rounds follow each other: in bursts of three with a pause, one at a time with a pause, or without any pause at all."}
        >
            <PageSelectField
                value={iterationPatternKey}
                values={ParticleIterationPatterns.PATTERN_TYPES}
                width={FIELD_WIDTH}
                ariaLabel={"Iteration pattern"}
                onChange={(key) => (iterationPatternKey = key)}
            />
        </PageProp>

        <PageProp
            itemKey={"overshootPercent"}
            controls={"Sets how far the example's travel path runs past its end, sent to ParticleSpawnerProps.computeParticlePos"}
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
            controls={EXAMPLES_ONLY_PROP}
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
            controls={"Picks the speed curve of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos"}
            label={"Travel easing"}
            hint={"The speed curve a particle follows along its path."}
        >
            <PageSelectField
                value={travelEasingKey}
                values={ParticleTravelEasings.EASING_TYPES}
                width={FIELD_WIDTH}
                ariaLabel={"Travel easing"}
                onChange={(key) => (travelEasingKey = key)}
            />
        </PageProp>
    </PagePropsPanel>
</PagePropsGroups>

<PageExamples items={examples} layout={"flow"} />
