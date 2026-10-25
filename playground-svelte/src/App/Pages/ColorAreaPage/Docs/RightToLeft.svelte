<script lang="ts">
    import { ColorArea } from "@thewaver/ss-components-svelte";
    import { COLOR_AREA_AXIS_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { STARTING_HSV } from "@thewaver/ss-playground/App/Pages/ColorAreaPage/ColorAreaPage.const";
    import type { Color } from "@thewaver/ss-utils";

    import PageColorAreaContent from "../../../StyledComponents/ColorAreaContent/PageColorAreaContent.svelte";

    const AREA_SIZE = 160;

    let hsv = $state.raw<Color.HSVA>(STARTING_HSV);
</script>

<div dir={"rtl"} style="width: 100%">
    <ColorArea
        bind:hsv
        sizing={"fill"}
        ariaLabel={"Saturation and brightness in a right-to-left box"}
        axisLabels={COLOR_AREA_AXIS_LABELS}
    >
        {#snippet renderContent(renderProps)}
            <PageColorAreaContent {renderProps} size={AREA_SIZE} />
        {/snippet}
    </ColorArea>
</div>

<div class={exampleStyles.exampleReadout} data-readout>
    {`Saturation ${Math.round(hsv.s)}%, brightness ${Math.round(hsv.v)}%`}
</div>
