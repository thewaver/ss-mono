<script lang="ts">
    import { Select } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageSelectClear from "../../../StyledComponents/SelectClear/SelectClear.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { COUNTRIES, PLACEHOLDER, QUERY_PADDING, renderSelectPopup } from "../SelectPage.const.svelte";

    let value = $state<string | undefined>("Estonia");
    let lastChange = $state("none yet");
</script>

<Select
    renderHighlightFloater={renderPageHighlightFloater}
    bind:value
    options={COUNTRIES}
    ariaLabel={"Country"}
    clearAriaLabel={"Clear country"}
    padding={QUERY_PADDING}
    renderPopup={renderSelectPopup}
    onSelectionChange={(next) => {
        lastChange = next ?? "cleared";
    }}
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

<div class={exampleStyles.exampleReadout} data-readout>{`Last change: ${lastChange}`}</div>
