<script lang="ts">
    import { SlotText } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";

    import type { SlotTextExampleProps } from "../SlotTextPage.types";

    const DIGIT_SIZE = { width: 40, height: 60 };

    type Props = SlotTextExampleProps;

    let props: Props = $props();
</script>

<div class={styles.board}>
    <SlotText
        text={props.text}
        mechanism={"splitFlap"}
        characterSize={DIGIT_SIZE}
        turnDurationMs={props.turnDurationMs}
        turnDelayMs={props.turnDelayMs}
        ariaLabel={"Departures"}
    >
        {#snippet renderTurning(digit)}
            <div class={styles.flapTile}>{digit}</div>
        {/snippet}

        {#snippet renderFixed(character)}
            <div class={styles.flapFixed}>{character}</div>
        {/snippet}
    </SlotText>
</div>
