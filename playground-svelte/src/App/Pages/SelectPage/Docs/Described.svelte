<script lang="ts">
    import { Select } from "@thewaver/ss-components-svelte";
    import type { Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { DELIVERIES, PLACEHOLDER, renderSelectPopup } from "../SelectPage.const.svelte";

    let value = $state.raw<Delivery | undefined>();
</script>

<Select
    renderHighlightFloater={renderPageHighlightFloater}
    bind:value
    options={DELIVERIES}
    ariaLabel={"Delivery"}
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
