<script lang="ts">
    import type { Snippet } from "svelte";

    import { Shape } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
    import { computeTooltipGeometry } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.utils";
    import { themeVars } from "@thewaver/ss-playground/App/Theme.css";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import type { TooltipContentProps } from "./TooltipContent.types";

    let props: TooltipContentProps & { children?: Snippet } = $props();
</script>

{#snippet renderBody()}
    <div class={[styles.tooltipBody, props.isWide && styles.tooltipBodyWide]}>
        <PageLayer level={2}>{@render props.children?.()}</PageLayer>
    </div>
{/snippet}

<div
    class={[
        styles.tooltipVisibility,
        styles.tooltipRevealVariants[props.reveal ?? "fade"],
        props.visibilityTarget === 1 && styles.isVisible,
    ]}
    style:transition-duration={`${props.transitionDurationMs}ms`}
>
    <div class={styles.tooltipShadow}>
        <Shape
            computePoints={(size) => computeTooltipGeometry(size, props)}
            computeFillDefs={() => [{ color: themeVars.color.surface.dark }]}
            renderChildren={renderBody}
        />
    </div>
</div>
