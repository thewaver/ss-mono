<script lang="ts">
    import { AudioSwitcher, Button } from "@thewaver/ss-components-svelte";
    import type { AudioSwitcherController } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/AudioSwitcherPage/AudioSwitcherPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import type { AudioSwitcherBasicDocsExampleProps } from "../AudioSwitcherPageSvelte.types";

    type Props = AudioSwitcherBasicDocsExampleProps;

    let props: Props = $props();

    let controller = $state.raw<AudioSwitcherController>();
    let isPlaying = $state(false);
</script>

<div class={styles.deck}>
    <div class={styles.row}>
        <Button
            id={"playPause"}
            ariaLabel={isPlaying ? "Pause" : "Play"}
            onClick={() => {
                isPlaying = !isPlaying;
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags} glyph={isPlaying ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play} />
            {/snippet}
        </Button>

        <Button
            id={"startOver"}
            isDisabled={!isPlaying}
            ariaLabel={"Start over"}
            onClick={() => {
                controller?.reset();
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS.replay} />
            {/snippet}
        </Button>
    </div>

    <AudioSwitcher
        src={props.src}
        crossfadeMs={props.crossfadeMs}
        volume={props.volume}
        bind:playback={isPlaying}
        onMount={(next) => {
            controller = next;
        }}
    />
</div>
