<script lang="ts">
    import { MultiSelect } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageSelectClear from "../../../StyledComponents/SelectClear/SelectClear.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { COUNTRIES, PLACEHOLDER, QUERY_PADDING, renderSelectPopup } from "../../SelectPage/SelectPage.const.svelte";

    let values = $state<string[]>(["Belgium", "Sweden"]);
    let lastChange = $state("none yet");
</script>

<MultiSelect
    renderHighlightFloater={renderPageHighlightFloater}
    bind:values
    options={COUNTRIES}
    ariaLabel={"Countries"}
    clearAriaLabel={"Clear countries"}
    padding={QUERY_PADDING}
    renderPopup={renderSelectPopup}
    onSelectionChange={(next) => {
        lastChange = next.length ? next.join(", ") : "cleared";
    }}
>
    {#snippet renderContent(selectedOptions, flags)}
        <PageSelectContent {flags} hasClearSpace={true}>
            {selectedOptions.length ? selectedOptions.map((option) => option.value).join(", ") : PLACEHOLDER}
        </PageSelectContent>
    {/snippet}

    {#snippet renderOption(option, flags)}
        <PageSelectOptionContent isGliding {flags}>{option.value}</PageSelectOptionContent>
    {/snippet}

    {#snippet renderClear(flags)}
        <PageSelectClear {flags} />
    {/snippet}
</MultiSelect>

<div class={exampleStyles.exampleReadout} data-readout>{`Last change: ${lastChange}`}</div>
