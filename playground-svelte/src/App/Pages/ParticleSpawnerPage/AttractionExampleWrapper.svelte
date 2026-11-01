<script lang="ts">
    import { ParticleSpawnerKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleSpawners.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import AttractionExample from "./Examples/Attraction.svelte";
    import type { PlaybackSlot } from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.types";
    import type { ParticleSpawnerExampleProps, ProgressSlot } from "./ParticleSpawnerPage.types";
    import ScrubbedExampleWrapper from "./ScrubbedExampleWrapper.svelte";

    let {
        exampleProps,
        isPagePlaying,
        playback = $bindable(),
    }: {
        exampleProps: Omit<ParticleSpawnerExampleProps, "playback">;
        isPagePlaying: boolean;
        playback: boolean;
    } = $props();

    let strengthRatio = $state(ParticleSpawnerKnobs.STARTING_ATTRACTION_STRENGTH_RATIO);
    let reachPixels = $state(ParticleSpawnerKnobs.STARTING_ATTRACTION_REACH_PIXELS);
</script>

{#snippet renderExample(examplePlayback: PlaybackSlot, progress: ProgressSlot)}
    <AttractionExample
        {...exampleProps}
        bind:playback={() => examplePlayback.value, (next) => (examplePlayback.value = next)}
        bind:progress={() => progress.value, (next) => (progress.value = next)}
        attractionStrengthRatio={strengthRatio}
        attractionReachPixels={reachPixels}
    />
{/snippet}

<ScrubbedExampleWrapper id={"attraction"} {isPagePlaying} bind:playback {renderExample} />

<PageExampleKnobs>
    <PageProp
        itemKey={"attractionStrengthRatio"}
        controls={"Sets strengthRatio of ParticleModifierUtils.createAttraction, sent to ParticleSpawnerProps.particleModifiers"}
        label={"Strength"}
        hint={"How much of the way to the ring a particle passing right by it is drawn."}
    >
        <PageNumberField
            value={strengthRatio}
            min={ParticleSpawnerKnobs.MIN_ATTRACTION_STRENGTH_RATIO}
            max={ParticleSpawnerKnobs.MAX_ATTRACTION_STRENGTH_RATIO}
            step={ParticleSpawnerKnobs.ATTRACTION_STRENGTH_RATIO_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Attraction strength"}
            onInput={(value) => (strengthRatio = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"attractionReachPixels"}
        controls={"Sets reachPixels of ParticleModifierUtils.createAttraction, sent to ParticleSpawnerProps.particleModifiers"}
        label={"Reach (px)"}
        hint={"How far from the ring the pull is felt at all. Particles passing farther away are left alone."}
    >
        <PageNumberField
            value={reachPixels}
            min={ParticleSpawnerKnobs.MIN_ATTRACTION_REACH_PIXELS}
            max={ParticleSpawnerKnobs.MAX_ATTRACTION_REACH_PIXELS}
            step={ParticleSpawnerKnobs.ATTRACTION_REACH_STEP_PIXELS}
            width={FIELD_WIDTH}
            ariaLabel={"Attraction reach in pixels"}
            onInput={(value) => (reachPixels = value)}
        />
    </PageProp>
</PageExampleKnobs>
