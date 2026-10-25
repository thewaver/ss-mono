<script lang="ts">
    import { ColorInput } from "@thewaver/ss-components-svelte";
    import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

    import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker.svelte";
    import PageColorInputContent from "../../../StyledComponents/ColorInputContent/ColorInputContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { ColorInputTooltipDocsExampleProps } from "../ColorInputPageSvelte.types";

    type Props = ColorInputTooltipDocsExampleProps;

    let props: Props = $props();

    let value = $state("#888888");
</script>

<ColorInput
    {...pageColorPickerSlots}
    bind:value
    isDisabled={props.isDisabled}
    isReachableWhenDisabled={props.isReachableWhenDisabled}
    ariaLabel={"Disabled but reachable color"}
    {...COLOR_INPUT_LABELS}
    tooltipDefs={{
        placement: { x: "center", y: "top_out" },
        offset: { x: 0, y: 10 },
        renderContent: tooltip,
    }}
>
    {#snippet renderContent(renderProps)}
        <PageColorInputContent {renderProps} />
    {/snippet}
</ColorInput>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        Focusable so this tooltip can be read, but the picker must not open.
    </PageTooltipContent>
{/snippet}
