<script lang="ts">
    import { SlotText } from "@thewaver/ss-components-svelte";
    import { WORD_LETTERS } from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";

    import type { SlotTextWordsExampleProps } from "../SlotTextPage.types";

    const CHARACTER_SIZE = { width: 34, height: 52 };

    type Props = SlotTextWordsExampleProps;

    let props: Props = $props();

    const tileClass = $derived(props.mechanism === "splitFlap" ? styles.flapTile : styles.digit);
</script>

<SlotText
    text={props.text}
    letters={WORD_LETTERS}
    letterRoute={props.letterRoute}
    mechanism={props.mechanism}
    characterSize={CHARACTER_SIZE}
    turnDurationMs={props.turnDurationMs}
    turnDelayMs={props.turnDelayMs}
    ariaLabel={"Destination"}
>
    {#snippet renderTurning(character)}
        <div class={tileClass}>{character}</div>
    {/snippet}
</SlotText>
