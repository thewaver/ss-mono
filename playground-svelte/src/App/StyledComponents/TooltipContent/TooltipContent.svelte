<script lang="ts">
    import type { Snippet } from "svelte";

    import { GlassSurface, type PartialGlassDefs } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
    import { BORDER_RADIUS_FULL } from "@thewaver/ss-playground/App/Theme.const";
    import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
    import { CSSUtils } from "@thewaver/ss-utils";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import type { TooltipContentProps } from "./TooltipContent.types";

    const TINT_GRADIENT_ANGLE = 45;

    const BORDER_RADII = CSSUtils.spreadRadius(BORDER_RADIUS_FULL);

    const GLASS_DEFS: PartialGlassDefs = {
        tint: {
            opacity: 1,
            gradient: {
                kind: "linear",
                angle: TINT_GRADIENT_ANGLE,
                colors: [{ value: themeVars.color.surface.dark }, { value: themeVars.color.surface.light }],
            },
        },
        sheen: { specularConstant: 0 },
    };

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
    <GlassSurface borderRadii={BORDER_RADII} glassDefs={GLASS_DEFS}>
        <div class={styles.tooltipBody}>
            <PageLayer level={2}>{@render props.children?.()}</PageLayer>
        </div>
    </GlassSurface>
</div>
