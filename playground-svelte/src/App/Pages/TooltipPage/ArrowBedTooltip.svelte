<script lang="ts">
    import { Shape } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
    import { computeArrowBedPoints } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.utils";
    import { TOOLTIP_ARROW_TEMPLATES } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";
    import * as tooltipStyles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
    import { BORDER_RADIUS_FULL } from "@thewaver/ss-playground/App/Theme.const";
    import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
    import { ShapeUtils } from "@thewaver/ss-utils";

    import type { ArrowBedTooltipProps } from "./TooltipPageSvelte.types";

    type Props = ArrowBedTooltipProps;

    const SHARP_RADII = [0];

    const ROUNDED_RADII = [BORDER_RADIUS_FULL];

    let props: Props = $props();
</script>

<div class={tooltipStyles.tooltipShadow}>
    <Shape
        computePoints={(size) =>
            ShapeUtils.attachArrow(
                {
                    points: computeArrowBedPoints(props.shape, size),
                    joinRadii: props.shape === "rounded_box" ? ROUNDED_RADII : SHARP_RADII,
                },
                props.computeAim(size),
                TOOLTIP_ARROW_TEMPLATES[props.arrow](props.arrowWidth, props.arrowLength),
            )}
        computeFillDefs={() => [{ color: themeVars.color.surface.dark }]}
    >
        {#snippet renderChildren()}
            <div class={styles.arrowBedLabel}>{props.label}</div>
        {/snippet}
    </Shape>
</div>
