<script lang="ts">
    import type { Snippet } from "svelte";

    import { GlassSurface, type PartialGlassDefs, Shape } from "@thewaver/ss-components-svelte";
    import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
    import { TOOLTIP_ARROW_TEMPLATES } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
    import { BORDER_RADIUS_FULL } from "@thewaver/ss-playground/App/Theme.const";
    import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
    import { CSSUtils, ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

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

    const arrow = $derived(props.arrow === undefined || props.arrow === "none" ? undefined : props.arrow);
</script>

{#snippet renderBody()}
    <div class={styles.tooltipBody}>
        <PageLayer level={2}>{@render props.children?.()}</PageLayer>
    </div>
{/snippet}

<div
    class={[
        styles.tooltipVisibility,
        styles.tooltipRevealVariants[props.reveal ?? "fade"],
        props.visibilityTarget === 1 && styles.isVisible,
        arrow && styles.tooltipArrowed,
    ]}
    style:transition-duration={`${props.transitionDurationMs}ms`}
>
    {#if arrow}
        <div class={styles.tooltipArrowShadow}>
            <Shape
                computePoints={(size) =>
                    ShapeUtils.attachArrow(
                        { points: ShapeConst.getDefaultShapePoints("square", size), joinRadii: [BORDER_RADIUS_FULL] },
                        props.arrowAim,
                        TOOLTIP_ARROW_TEMPLATES[arrow](
                            props.arrowWidth ?? TooltipKnobs.STARTING_ARROW_WIDTH,
                            props.arrowLength ?? TooltipKnobs.STARTING_ARROW_LENGTH,
                        ),
                    )}
                computeFillDefs={() => [{ color: themeVars.color.surface.dark }]}
                renderChildren={renderBody}
            />
        </div>
    {:else}
        <GlassSurface borderRadii={BORDER_RADII} glassDefs={GLASS_DEFS}>
            {@render renderBody()}
        </GlassSurface>
    {/if}
</div>
