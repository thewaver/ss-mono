<script lang="ts">
    import { Button, Wraparound } from "@thewaver/ss-components-svelte";
    import { MARQUEE_WORDS } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { WraparoundMarqueeExampleProps } from "../WraparoundPage.types";

    type Props = WraparoundMarqueeExampleProps;

    let { playback = $bindable(), ...props }: Props = $props();
</script>

<div class={styles.marqueeStack}>
    <div class={styles.marqueeStage}>
        <Wraparound
            ariaLabel={"Tools this library is built with, drifting past"}
            isMovable={false}
            driftPxPerSecond={props.driftPxPerSecond}
            driftDegrees={props.driftDegrees}
            bind:playback
        >
            {#snippet renderContent()}
                <div class={styles.marqueeTile}>
                    {#each MARQUEE_WORDS as word (word)}
                        <span class={styles.marqueeWord}>{word}</span>
                    {/each}
                </div>
            {/snippet}
        </Wraparound>
    </div>

    <Button
        id={"marqueePlayback"}
        onClick={() => {
            playback = !playback;
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>{playback ? "Pause" : "Play"}</PageButtonContent>
        {/snippet}
    </Button>
</div>
