<script lang="ts">
    import { ParticleSpawnerKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleSpawners.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import WindExample from "./Examples/Wind.svelte";
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

    let directionDegrees = $state(ParticleSpawnerKnobs.STARTING_WIND_DIRECTION_DEGREES);
    let strengthPixels = $state(ParticleSpawnerKnobs.STARTING_WIND_STRENGTH_PIXELS);
    let gustRatio = $state(ParticleSpawnerKnobs.STARTING_WIND_GUST_RATIO);
</script>

{#snippet renderExample(examplePlayback: PlaybackSlot, progress: ProgressSlot)}
    <WindExample
        {...exampleProps}
        bind:playback={() => examplePlayback.value, (next) => (examplePlayback.value = next)}
        bind:progress={() => progress.value, (next) => (progress.value = next)}
        windDirectionDegrees={directionDegrees}
        windStrengthPixels={strengthPixels}
        windGustRatio={gustRatio}
    />
{/snippet}

<ScrubbedExampleWrapper id={"wind"} {isPagePlaying} bind:playback {renderExample} />

<PageExampleKnobs>
    <PageProp
        itemKey={"windDirectionDegrees"}
        {...ParticleSpawnerKnobs.WIND_DIRECTION_DEGREES_TEXT}
    >
        <PageNumberField
            value={directionDegrees}
            min={ParticleSpawnerKnobs.MIN_WIND_DIRECTION_DEGREES}
            max={ParticleSpawnerKnobs.MAX_WIND_DIRECTION_DEGREES}
            step={ParticleSpawnerKnobs.WIND_DIRECTION_STEP_DEGREES}
            width={FIELD_WIDTH}
            ariaLabel={"Wind direction in degrees"}
            onInput={(value) => (directionDegrees = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"windStrengthPixels"}
        {...ParticleSpawnerKnobs.WIND_STRENGTH_PIXELS_TEXT}
    >
        <PageNumberField
            value={strengthPixels}
            min={ParticleSpawnerKnobs.MIN_WIND_STRENGTH_PIXELS}
            max={ParticleSpawnerKnobs.MAX_WIND_STRENGTH_PIXELS}
            step={ParticleSpawnerKnobs.WIND_STRENGTH_STEP_PIXELS}
            width={FIELD_WIDTH}
            ariaLabel={"Wind strength in pixels"}
            onInput={(value) => (strengthPixels = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"windGustRatio"}
        {...ParticleSpawnerKnobs.WIND_GUST_RATIO_TEXT}
    >
        <PageNumberField
            value={gustRatio}
            min={ParticleSpawnerKnobs.MIN_WIND_GUST_RATIO}
            max={ParticleSpawnerKnobs.MAX_WIND_GUST_RATIO}
            step={ParticleSpawnerKnobs.WIND_GUST_RATIO_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Wind gusts"}
            onInput={(value) => (gustRatio = value)}
        />
    </PageProp>
</PageExampleKnobs>
