<script lang="ts">
    import {
        SKIN_SAMPLE_TOOLTIP_TEXT,
        computeSkinSampleTooltipAim,
    } from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.css";
    import * as tooltipStyles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
    import { computeTooltipGeometry } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.utils";

    import TooltipSurface from "../../StyledComponents/TooltipContent/TooltipSurface.svelte";
</script>

<div class={styles.skinTooltipSample}>
    <TooltipSurface
        hasArrow={true}
        computeGeometry={(size, bodyStyle) =>
            computeTooltipGeometry(size, { arrow: "even", arrowAim: computeSkinSampleTooltipAim(size) }, bodyStyle)}
    >
        <div class={tooltipStyles.tooltipBody}>{SKIN_SAMPLE_TOOLTIP_TEXT}</div>
    </TooltipSurface>
</div>
