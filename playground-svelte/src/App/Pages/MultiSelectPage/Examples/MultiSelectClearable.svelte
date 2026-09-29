<script lang="ts">
    import { MultiSelect } from "@thewaver/ss-components-svelte";

    import PageSelectClear from "../../../StyledComponents/SelectClear/SelectClear.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { COUNTRIES, PLACEHOLDER, QUERY_PADDING, renderSelectPopup } from "../../SelectPage/SelectPage.const.svelte";
    import type { MultiSelectClearableExampleProps } from "../MultiSelectPage.types";

    type Props = MultiSelectClearableExampleProps;

    let { values = $bindable(), ...props }: Props = $props();
</script>

<MultiSelect
    bind:values
    options={COUNTRIES}
    ariaLabel={"Countries"}
    clearAriaLabel={"Clear countries"}
    padding={QUERY_PADDING}
    renderPopup={renderSelectPopup}
    onSelectionChange={props.onSelectionChange}
>
    {#snippet renderContent(selectedOptions, flags)}
        <PageSelectContent {flags} hasClearSpace={true}>
            {selectedOptions.length ? selectedOptions.map((option) => option.value).join(", ") : PLACEHOLDER}
        </PageSelectContent>
    {/snippet}

    {#snippet renderOption(option, flags)}
        <PageSelectOptionContent {flags}>{option.value}</PageSelectOptionContent>
    {/snippet}

    {#snippet renderClear(flags)}
        <PageSelectClear {flags} />
    {/snippet}
</MultiSelect>
