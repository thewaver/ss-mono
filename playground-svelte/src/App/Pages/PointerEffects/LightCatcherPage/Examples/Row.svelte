<script lang="ts">
    import { LightCatcher } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/LightCatcherPage/LightCatcherPage.css";

    import type { LightCatcherExampleProps } from "../LightCatcherPageSvelte.types";

    const LAMPS = [1, 2, 3, 4, 5];

    type Props = LightCatcherExampleProps;

    let props: Props = $props();
</script>

<div class={styles.row}>
    {#each LAMPS as lamp (lamp)}
        <div class={styles.lampSlot}>
            <LightCatcher
                isDisabled={props.isDisabled}
                activeRangePx={props.activeRangePx}
                smoothingMs={props.smoothingMs}
                lightRangePx={props.lightRangePx}
                maxBrightness={props.maxBrightness}
                restingBrightness={props.restingBrightness}
                maxLightness={props.maxLightness}
                restingLightness={props.restingLightness}
            >
                <div class={styles.lamp}>{lamp}</div>
            </LightCatcher>
        </div>
    {/each}
</div>
