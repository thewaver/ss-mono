<script lang="ts">
    import { AUDIO_SWITCHER_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { AudioSwitcherKnobs } from "@thewaver/ss-playground/App/Knobs/AudioSwitchers.const";
    import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
    import {
        DOCS_ROOT,
        FIELD_WIDTH,
        PERCENT,
        TRACKS,
        TRACK_NAMES,
    } from "@thewaver/ss-playground/App/Pages/AudioSwitcherPage/AudioSwitcherPage.const";

    import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.svelte";
    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";

    let trackName = $state(TRACKS[0].name);
    let crossfadeMs = $state(AudioSwitcherKnobs.STARTING_CROSSFADE_MS);
    let volumePercent = $state(AUDIO_SWITCHER_DEFAULTS.volume * PERCENT);

    const src = $derived(TRACKS.find((track) => track.name === trackName)?.src ?? TRACKS[0].src);
</script>

<PageDocsAlert severity="alert">
    The switcher draws nothing, so the buttons that play and pause it are yours to build. It starts on its own only when
    you set <span class={docsStyles.docsPropName}>shouldAutoPlayOnMount</span>; if you do, and the sound lasts longer
    than three seconds, the page needs a control that pauses or stops it (<a href={WCAG_URLS["1.4.2"]}>WCAG 1.4.2</a>),
    or the sound drowns out a screen reader.
</PageDocsAlert>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {src} {crossfadeMs} volume={volumePercent / PERCENT} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"track"}
            label={"Track"}
            hint={"Which piece is playing. Changing it while it plays is what the switcher crossfades."}
            controls={"Picks the example track sent to AudioSwitcherProps.src"}
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
            controls={"Sets AudioSwitcherProps.crossfadeMs"}
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

        <PageProp
            itemKey={"volume"}
            label={"Volume (%)"}
            hint={"How loud the playback is, apart from the system's own volume."}
            controls={"Sets AudioSwitcherProps.volume, sent as a share of 1"}
        >
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
    {/snippet}
</PageDocsExample>
