<script lang="ts">
    import { Select } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageSelectClear from "../../../StyledComponents/SelectClear/SelectClear.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { COUNTRIES, PLACEHOLDER, QUERY_PADDING, renderSelectPopup } from "../SelectPage.const.svelte";

    let value = $state<string | undefined>("Estonia");
</script>

<div dir={"rtl"}>
    <Select
        renderHighlightFloater={renderPageHighlightFloater}
        bind:value
        options={COUNTRIES}
        ariaLabel={"Country"}
        clearAriaLabel={"Clear country"}
        padding={QUERY_PADDING}
        renderPopup={renderSelectPopup}
    >
        {#snippet renderContent(selectedOption, flags)}
            <PageSelectContent {flags} hasClearSpace={true}>
                {selectedOption?.value ?? PLACEHOLDER}
            </PageSelectContent>
        {/snippet}

        {#snippet renderOption(option, flags)}
            <PageSelectOptionContent isGliding {flags}>{option.value}</PageSelectOptionContent>
        {/snippet}

        {#snippet renderClear(flags)}
            <PageSelectClear {flags} />
        {/snippet}
    </Select>
</div>
