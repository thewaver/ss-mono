<script lang="ts">
    import { ColorInput } from "@thewaver/ss-components-svelte";
    import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

    import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker.svelte";
    import PageColorInputContent from "../../../StyledComponents/ColorInputContent/ColorInputContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { ColorInputExampleProps } from "../ColorInputPage.types";

    type Props = ColorInputExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<ColorInput
    {...pageColorPickerSlots}
    bind:value
    isDisabled={true}
    isReachableWhenDisabled={true}
    ariaLabel={"Disabled but reachable color"}
    {...COLOR_INPUT_LABELS}
    tooltipDefs={{
        placement: { x: "center", y: "top-out" },
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
        Focusable so this tooltip can be read, but the OS picker must not open.
    </PageTooltipContent>
{/snippet}
