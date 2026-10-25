<script lang="ts">
    import { Select } from "@thewaver/ss-components-svelte";
    import type { Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { PLACEHOLDER, createStressDeliveries, renderSelectPopup } from "../SelectPage.const.svelte";
    import type { SelectVirtualizedDocsExampleProps } from "../SelectPageSvelte.types";

    const OPTION_HEIGHT = 100;

    type Props = SelectVirtualizedDocsExampleProps;

    let { visibility = $bindable(), ...props }: Props = $props();

    let value = $state.raw<Delivery | undefined>();

    const options = $derived(createStressDeliveries(props.count));
</script>

<Select
    renderHighlightFloater={renderPageHighlightFloater}
    bind:value
    bind:visibility
    {options}
    ariaLabel={"Route"}
    computeEstimatedOptionHeight={() => OPTION_HEIGHT}
    computeCustomText={(option) => option.value.name}
    renderPopup={renderSelectPopup}
>
    {#snippet renderContent(selectedOption, flags)}
        <PageSelectContent {flags}>{selectedOption?.value.name ?? PLACEHOLDER}</PageSelectContent>
    {/snippet}

    {#snippet renderOption(option, flags)}
        <PageSelectOptionContent isGliding {flags} description={option.value.description}>
            {option.value.name}
        </PageSelectOptionContent>
    {/snippet}
</Select>
