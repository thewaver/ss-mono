<script lang="ts">
    import { Tilter } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/TilterPage/TilterPage.css";

    import type { TilterExampleProps } from "../TilterPageSvelte.types";

    const SHEEN_ANGLE_DEGREES = 115;

    type Props = TilterExampleProps;

    let props: Props = $props();
</script>

<Tilter
    isDisabled={props.isDisabled}
    activeRangePx={props.activeRangePx}
    smoothingMs={props.smoothingMs}
    tiltRangePx={props.tiltRangePx}
    maxTiltDegrees={props.maxTiltDegrees}
    perspectivePx={props.perspectivePx}
>
    {#snippet renderSheen(state)}
        <div
            class={styles.sheen}
            style:opacity={props.sheenOpacity * state.strength}
            style:background-image={`linear-gradient(${SHEEN_ANGLE_DEGREES}deg, transparent ${state.sheenPosition - props.sheenSpreadPercent}%, rgb(255 255 255 / 0.5) ${state.sheenPosition}%, transparent ${state.sheenPosition + props.sheenSpreadPercent}%)`}
        ></div>
    {/snippet}

    <div class={styles.card}>Tip me</div>
</Tilter>
