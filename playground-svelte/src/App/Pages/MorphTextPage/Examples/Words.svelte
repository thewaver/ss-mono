<script lang="ts">
    import { Button, MorphText } from "@thewaver/ss-components-svelte";
    import { MorphTextKnobs } from "@thewaver/ss-playground/App/Knobs/MorphTexts.const";
    import { MORPH_WORDS } from "@thewaver/ss-playground/App/Pages/MorphTextPage/MorphTextPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/MorphTextPage/MorphTextPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { MorphTextExampleProps } from "../MorphTextPage.types";

    type Props = MorphTextExampleProps;

    let props: Props = $props();

    let index = $state(0);
    let isPlaying = $state(true);

    $effect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            index = (index + 1) % MORPH_WORDS.length;
        }, MorphTextKnobs.CYCLE_MS);

        return () => clearInterval(interval);
    });

    $effect(() => {
        props.onWordChange(MORPH_WORDS[index]);
    });
</script>

<div class={styles.stage}>
    <div class={styles.word}>
        <MorphText text={MORPH_WORDS[index]} morphDurationMs={props.morphDurationMs} maxBlurPx={props.maxBlurPx} />
    </div>

    <Button
        id={"morphWordsPlayback"}
        onClick={() => {
            isPlaying = !isPlaying;
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>{isPlaying ? "Pause" : "Play"}</PageButtonContent>
        {/snippet}
    </Button>
</div>
