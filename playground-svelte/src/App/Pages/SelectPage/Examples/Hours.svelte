<script lang="ts">
    import { Select } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { HOURS, PLACEHOLDER, renderSelectPopup } from "../SelectPage.const.svelte";
    import type { SelectExampleProps } from "../SelectPage.types";

    type Props = SelectExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<Select
    renderHighlightFloater={renderPageHighlightFloater}
    bind:value
    options={HOURS}
    ariaLabel={"Departure hour"}
    renderPopup={renderSelectPopup}
>
    {#snippet renderContent(selectedOption, flags)}
        <PageSelectContent {flags}>{selectedOption?.value ?? PLACEHOLDER}</PageSelectContent>
    {/snippet}

    {#snippet renderOption(option, flags)}
        <PageSelectOptionContent isGliding {flags}>{option.value}</PageSelectOptionContent>
    {/snippet}
</Select>
