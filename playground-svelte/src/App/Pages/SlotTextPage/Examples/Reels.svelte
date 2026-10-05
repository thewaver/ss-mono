<script lang="ts">
    import { SlotText, SlotTextReels } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";

    import type { SlotTextReelsExampleProps } from "../SlotTextPage.types";

    const DIGIT_SIZE = { width: 34, height: 52 };

    type Props = SlotTextReelsExampleProps;

    let props: Props = $props();
</script>

<SlotText
    text={props.text}
    characterSize={DIGIT_SIZE}
    ariaLabel={"Slot machine"}
    computeReel={(digitIndex, digitCount) => SlotTextReels.SAMPLE_REELS[props.reelKey](digitIndex, digitCount)}
>
    {#snippet renderTurning(digit)}
        <div class={styles.digit}>{digit}</div>
    {/snippet}
</SlotText>
