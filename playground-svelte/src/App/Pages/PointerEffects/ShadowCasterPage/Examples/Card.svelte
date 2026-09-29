<script lang="ts">
    import { ShadowCaster } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/ShadowCasterPage/ShadowCasterPage.css";

    import type { ShadowCasterExampleProps } from "../ShadowCasterPageSvelte.types";

    type Props = ShadowCasterExampleProps;

    let props: Props = $props();
</script>

<div class={styles.stage}>
    <ShadowCaster
        isDisabled={props.isDisabled}
        activeRangePx={props.activeRangePx}
        smoothingMs={props.smoothingMs}
        lightRangePx={props.lightRangePx}
        maxThrowPx={props.maxThrowPx}
        minBlurPx={props.minBlurPx}
        maxBlurPx={props.maxBlurPx}
        maxOpacity={props.maxOpacity}
        minOpacity={props.minOpacity}
        restingOpacity={props.restingOpacity}
        color={props.color}
    >
        <div class={styles.card}>Move the pointer around me</div>
    </ShadowCaster>
</div>
