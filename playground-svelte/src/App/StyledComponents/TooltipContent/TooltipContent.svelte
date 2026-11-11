<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
    import {
        computeTooltipGeometry,
        getTooltipHasArrow,
    } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.utils";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import type { TooltipContentProps } from "./TooltipContent.types";
    import TooltipSurface from "./TooltipSurface.svelte";

    let props: TooltipContentProps & { children?: Snippet } = $props();
</script>

<div
    class={[
        styles.tooltipVisibility,
        styles.tooltipRevealVariants[props.reveal ?? "fade"],
        props.visibilityTarget === 1 && styles.isVisible,
    ]}
    style:transition-duration={`${props.transitionDurationMs}ms`}
>
    <TooltipSurface
        hasArrow={getTooltipHasArrow(props.arrow)}
        computeGeometry={(size, bodyStyle) => computeTooltipGeometry(size, props, bodyStyle)}
    >
        <div class={[styles.tooltipBody, props.isWide && styles.tooltipBodyWide]}>
            <PageLayer>{@render props.children?.()}</PageLayer>
        </div>
    </TooltipSurface>
</div>
