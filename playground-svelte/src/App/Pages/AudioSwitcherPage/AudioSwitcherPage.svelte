<script lang="ts">
    import { AUDIO_SWITCHER_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { AudioSwitcherKnobs } from "@thewaver/ss-playground/App/Knobs/AudioSwitchers.const";
    import {
        FIELD_WIDTH,
        PERCENT,
        TRACKS,
        TRACK_NAMES,
    } from "@thewaver/ss-playground/App/Pages/AudioSwitcherPage/AudioSwitcherPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import DefaultExample from "./Examples/Default.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/AudioSwitcherPage/Examples";

    let crossfadeMs = $state(AudioSwitcherKnobs.STARTING_CROSSFADE_MS);
    let volumePercent = $state(AUDIO_SWITCHER_DEFAULTS.volume * PERCENT);
    let trackName = $state(TRACKS[0].name);

    let playback = $state(false);

    const src = $derived(TRACKS.find((track) => track.name === trackName)?.src ?? TRACKS[0].src);

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Crossfading between two loops",
            readout: () =>
                `${trackName} — ${playback ? "playing" : "stopped"}; nothing sounds until you ask, because a source arriving at mount does not start on its own — every switch after that does`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample {src} {crossfadeMs} volume={volumePercent / PERCENT} bind:playback />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"track"}
        label={"Track"}
        hint={"Which piece is playing. Changing it is what the switcher crossfades between."}
    >
        <PageSelectField
            value={trackName}
            values={TRACK_NAMES}
            width={FIELD_WIDTH}
            ariaLabel={"Track"}
            onChange={(name) => {
                trackName = name;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"crossfadeMs"}
        label={"Crossfade (ms)"}
        hint={"How long the old track takes to fade out while the new one fades in."}
    >
        <PageNumberField
            value={crossfadeMs}
            min={AudioSwitcherKnobs.MIN_CROSSFADE_MS}
            max={AudioSwitcherKnobs.MAX_CROSSFADE_MS}
            step={AudioSwitcherKnobs.CROSSFADE_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Crossfade in milliseconds"}
            onInput={(value) => {
                crossfadeMs = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"volume"} label={"Volume (%)"} hint={"How loud the playback is."}>
        <PageNumberField
            value={volumePercent}
            min={AudioSwitcherKnobs.MIN_VOLUME_PERCENT}
            max={AudioSwitcherKnobs.MAX_VOLUME_PERCENT}
            step={AudioSwitcherKnobs.VOLUME_STEP_PERCENT}
            width={FIELD_WIDTH}
            ariaLabel={"Volume as a percentage"}
            onInput={(value) => {
                volumePercent = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
