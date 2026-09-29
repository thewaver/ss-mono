<script lang="ts">
    import { Odometer } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/OdometerPage/OdometerPage.css";

    import type { OdometerExampleProps } from "../OdometerPage.types";
    import Fade from "./Fade.svelte";

    const DIGIT_SIZE = { width: 34, height: 52 };

    type Props = OdometerExampleProps;

    let props: Props = $props();
</script>

<Odometer
    text={props.text}
    digitSize={DIGIT_SIZE}
    turnDurationMs={props.turnDurationMs}
    cascadeDelayMs={props.cascadeDelayMs}
    ariaLabel={"Score"}
>
    {#snippet renderDigit(digit, flags)}
        <Fade className={styles.digit} {flags} durationMs={props.turnDurationMs}>{digit}</Fade>
    {/snippet}

    {#snippet renderFixed(character, flags)}
        <Fade className={styles.fixed} {flags} durationMs={props.turnDurationMs}>{character}</Fade>
    {/snippet}
</Odometer>
