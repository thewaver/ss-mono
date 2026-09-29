<script lang="ts">
    import { Select } from "@thewaver/ss-components-svelte";

    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import { COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../SelectPage.const.svelte";
    import type { SelectExampleProps } from "../SelectPage.types";

    type Props = SelectExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<Select
    bind:value
    options={COUNTRIES}
    isDisabled={true}
    isReachableWhenDisabled={true}
    ariaLabel={"Country"}
    renderPopup={renderSelectPopup}
    tooltipDefs={{
        placement: { x: "center", y: "top-out" },
        offset: { x: 0, y: 10 },
        renderContent: tooltip,
    }}
>
    {#snippet renderContent(selectedOption, flags)}
        <PageSelectContent {flags}>{selectedOption?.value ?? PLACEHOLDER}</PageSelectContent>
    {/snippet}

    {#snippet renderOption(option, flags)}
        <PageSelectOptionContent {flags}>{option.value}</PageSelectOptionContent>
    {/snippet}
</Select>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        Focusable so this can be read, but the list must not open.
    </PageTooltipContent>
{/snippet}
