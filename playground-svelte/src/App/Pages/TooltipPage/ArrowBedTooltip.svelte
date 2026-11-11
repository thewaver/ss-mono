<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
    import { computeArrowBedPoints } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.utils";
    import { TOOLTIP_ARROW_TEMPLATES } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";
    import { BORDER_RADIUS_FULL } from "@thewaver/ss-playground/App/Theme.const";
    import { ShapeUtils } from "@thewaver/ss-utils";

    import TooltipSurface from "../../StyledComponents/TooltipContent/TooltipSurface.svelte";
    import type { ArrowBedTooltipProps } from "./TooltipPageSvelte.types";

    type Props = ArrowBedTooltipProps;

    const SHARP_RADII = [0];

    const ROUNDED_RADII = [BORDER_RADIUS_FULL];

    let props: Props = $props();
</script>

<TooltipSurface
    hasArrow={true}
    computeGeometry={(size, bodyStyle) =>
        ShapeUtils.attachArrow(
            {
                points: computeArrowBedPoints(props.shape, size),
                joinRadii: props.shape === "rounded_box" ? ROUNDED_RADII : SHARP_RADII,
                lameExponents: bodyStyle?.lameExponents,
                strokeThicknesses: bodyStyle?.strokeThicknesses,
            },
            props.computeAim(size),
            TOOLTIP_ARROW_TEMPLATES[props.arrow](props.arrowWidth, props.arrowLength),
        )}
>
    <div class={styles.arrowBedLabel}>{props.label}</div>
</TooltipSurface>
