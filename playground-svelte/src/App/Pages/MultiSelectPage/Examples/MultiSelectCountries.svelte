<script lang="ts">
    import { MultiSelect } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../../SelectPage/SelectPage.const.svelte";

    type Props = {
        values: string[];
    };

    let { values = $bindable() }: Props = $props();
</script>

<MultiSelect
    renderHighlightFloater={renderPageHighlightFloater}
    bind:values
    options={COUNTRIES}
    ariaLabel={"Countries"}
    renderPopup={renderSelectPopup}
>
    {#snippet renderContent(selectedOptions, flags)}
        <PageSelectContent {flags}>
            {selectedOptions.length ? selectedOptions.map((option) => option.value).join(", ") : PLACEHOLDER}
        </PageSelectContent>
    {/snippet}

    {#snippet renderOption(option, flags)}
        <PageSelectOptionContent isGliding {flags}>{option.value}</PageSelectOptionContent>
    {/snippet}
</MultiSelect>
