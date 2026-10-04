<script lang="ts">
    import { Odometer } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/OdometerPage/OdometerPage.css";

    import type { OdometerExampleProps } from "../OdometerPage.types";

    const DIGIT_SIZE = { width: 40, height: 60 };

    type Props = OdometerExampleProps;

    let props: Props = $props();
</script>

<div class={styles.board}>
    <Odometer
        text={props.text}
        mechanism={"splitFlap"}
        digitSize={DIGIT_SIZE}
        turnDurationMs={props.turnDurationMs}
        cascadeDelayMs={props.cascadeDelayMs}
        ariaLabel={"Departures"}
    >
        {#snippet renderDigit(digit)}
            <div class={styles.flapTile}>{digit}</div>
        {/snippet}

        {#snippet renderFixed(character)}
            <div class={styles.flapFixed}>{character}</div>
        {/snippet}
    </Odometer>
</div>
