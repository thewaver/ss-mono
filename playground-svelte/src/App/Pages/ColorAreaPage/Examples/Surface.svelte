<script lang="ts">
    import { ColorArea } from "@thewaver/ss-components-svelte";
    import { COLOR_AREA_AXIS_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

    import PageColorAreaContent from "../../../StyledComponents/ColorAreaContent/PageColorAreaContent.svelte";
    import type { ColorAreaExampleProps } from "../ColorAreaPage.types";

    const AREA_SIZE = 160;

    type Props = ColorAreaExampleProps;

    let { hsv = $bindable(), ...props }: Props = $props();
</script>

<ColorArea
    bind:hsv
    sizing={"fill"}
    isDisabled={props.isDisabled ?? false}
    ariaLabel={"Saturation and brightness"}
    axisLabels={COLOR_AREA_AXIS_LABELS}
>
    {#snippet renderContent(renderProps)}
        <PageColorAreaContent {renderProps} size={AREA_SIZE} />
    {/snippet}
</ColorArea>
