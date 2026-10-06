<script lang="ts">
    import { AudioSwitcher, Button } from "@thewaver/ss-components-svelte";
    import type { AudioSwitcherController } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/AudioSwitcherPage/AudioSwitcherPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import type { AudioSwitcherExampleProps } from "../AudioSwitcherPage.types";

    type Props = AudioSwitcherExampleProps;

    let { playback = $bindable(), ...props }: Props = $props();

    let controller = $state.raw<AudioSwitcherController>();
</script>

<div class={styles.deck}>
    <div class={styles.row}>
        <Button
            ariaLabel={playback ? "Stop" : "Play"}
            onClick={() => {
                playback = !playback;
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags} glyph={playback ? CONTROL_GLYPHS.stop : CONTROL_GLYPHS.play} />
            {/snippet}
        </Button>

        <Button
            ariaLabel={"Start over"}
            isDisabled={!playback}
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
        bind:playback
        onMount={(next) => {
            controller = next;
        }}
    />
</div>
