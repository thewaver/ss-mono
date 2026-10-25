<script lang="ts">
    import { ColorArea } from "@thewaver/ss-components-svelte";
    import { COLOR_AREA_AXIS_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { STARTING_HSV } from "@thewaver/ss-playground/App/Pages/ColorAreaPage/ColorAreaPage.const";
    import { Color } from "@thewaver/ss-utils";

    import PageColorAreaContent from "../../../StyledComponents/ColorAreaContent/PageColorAreaContent.svelte";
    import type { ColorAreaBasicDocsExampleProps } from "../ColorAreaPageSvelte.types";

    const AREA_SIZE = 160;

    type Props = ColorAreaBasicDocsExampleProps;

    let props: Props = $props();

    let hsv = $state.raw<Color.HSVA>(STARTING_HSV);
</script>

<ColorArea
    bind:hsv
    sizing={"fill"}
    isDisabled={props.isDisabled}
    ariaLabel={"Saturation and brightness"}
    axisLabels={COLOR_AREA_AXIS_LABELS}
>
    {#snippet renderContent(renderProps)}
        <PageColorAreaContent {renderProps} size={AREA_SIZE} />
    {/snippet}
</ColorArea>

<div class={exampleStyles.exampleReadout} data-readout>
    {`Hue ${Math.round(hsv.h)}°, saturation ${Math.round(hsv.s)}%, brightness ${Math.round(hsv.v)}%, or ${Color.HSV.toHex(hsv)}`}
</div>
