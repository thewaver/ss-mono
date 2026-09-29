<script lang="ts">
    import { Odometer, OdometerReels } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/OdometerPage/OdometerPage.css";

    import type { OdometerReelsExampleProps } from "../OdometerPage.types";

    const DIGIT_SIZE = { width: 34, height: 52 };

    type Props = OdometerReelsExampleProps;

    let props: Props = $props();
</script>

<Odometer
    text={props.text}
    digitSize={DIGIT_SIZE}
    ariaLabel={"Slot machine"}
    computeReel={(digitIndex, digitCount) => OdometerReels.SAMPLE_REELS[props.reelKey](digitIndex, digitCount)}
>
    {#snippet renderDigit(digit)}
        <div class={styles.digit}>{digit}</div>
    {/snippet}
</Odometer>
