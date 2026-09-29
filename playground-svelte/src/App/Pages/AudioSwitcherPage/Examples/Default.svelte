<script lang="ts">
    import { AudioSwitcher, Button } from "@thewaver/ss-components-svelte";
    import type { AudioSwitcherController } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/AudioSwitcherPage/AudioSwitcherPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { AudioSwitcherExampleProps } from "../AudioSwitcherPage.types";

    type Props = AudioSwitcherExampleProps;

    let { playback = $bindable(), ...props }: Props = $props();

    let controller = $state.raw<AudioSwitcherController>();
</script>

<div class={styles.deck}>
    <div class={styles.row}>
        <Button
            onClick={() => {
                playback = !playback;
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>{playback ? "Stop" : "Play"}</PageButtonContent>
            {/snippet}
        </Button>

        <Button
            isDisabled={!playback}
            onClick={() => {
                controller?.reset();
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Start over</PageButtonContent>
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
