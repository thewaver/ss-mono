<script lang="ts">
    import { SlotText } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";

    import type { SlotTextExampleProps } from "../SlotTextPage.types";

    const CHARACTER_SIZE = { width: 34, height: 52 };

    type Props = SlotTextExampleProps;

    let props: Props = $props();
</script>

<SlotText
    text={props.text}
    mechanism={"splitFlap"}
    characterSize={CHARACTER_SIZE}
    turnDurationMs={props.turnDurationMs}
    turnDelayMs={props.turnDelayMs}
    ariaLabel={"Departures"}
>
    {#snippet renderTurning(digit)}
        <div class={styles.flapTile}>{digit}</div>
    {/snippet}

    {#snippet renderFixed(character)}
        <div class={styles.fixed}>{character}</div>
    {/snippet}
</SlotText>
