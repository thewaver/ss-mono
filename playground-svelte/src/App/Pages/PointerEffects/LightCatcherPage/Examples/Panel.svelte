<script lang="ts">
    import { LightCatcher } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/LightCatcherPage/LightCatcherPage.css";

    import type { LightCatcherExampleProps } from "../LightCatcherPageSvelte.types";

    type Props = LightCatcherExampleProps;

    let props: Props = $props();
</script>

<div class={styles.stage}>
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
        <div class={styles.panelCard}>Come nearer</div>
    </LightCatcher>
</div>
