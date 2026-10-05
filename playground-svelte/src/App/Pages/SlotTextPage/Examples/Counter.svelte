<script lang="ts">
    import { SlotText } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";

    import type { SlotTextExampleProps } from "../SlotTextPage.types";
    import Fade from "./Fade.svelte";

    const DIGIT_SIZE = { width: 34, height: 52 };

    type Props = SlotTextExampleProps;

    let props: Props = $props();
</script>

<SlotText
    text={props.text}
    characterSize={DIGIT_SIZE}
    turnDurationMs={props.turnDurationMs}
    turnDelayMs={props.turnDelayMs}
    ariaLabel={"Score"}
>
    {#snippet renderTurning(digit, flags)}
        <Fade className={styles.digit} {flags} durationMs={props.turnDurationMs}>{digit}</Fade>
    {/snippet}

    {#snippet renderFixed(character, flags)}
        <Fade className={styles.fixed} {flags} durationMs={props.turnDurationMs}>{character}</Fade>
    {/snippet}
</SlotText>
