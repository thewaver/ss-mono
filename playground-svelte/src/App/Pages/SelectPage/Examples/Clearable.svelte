<script lang="ts">
    import { Select } from "@thewaver/ss-components-svelte";

    import PageSelectClear from "../../../StyledComponents/SelectClear/SelectClear.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { COUNTRIES, PLACEHOLDER, QUERY_PADDING, renderSelectPopup } from "../SelectPage.const.svelte";
    import type { SelectClearableExampleProps } from "../SelectPage.types";

    type Props = SelectClearableExampleProps;

    let { value = $bindable(), ...props }: Props = $props();
</script>

<Select
    bind:value
    options={COUNTRIES}
    ariaLabel={"Country"}
    clearAriaLabel={"Clear country"}
    padding={QUERY_PADDING}
    renderPopup={renderSelectPopup}
    onSelectionChange={props.onSelectionChange}
>
    {#snippet renderContent(selectedOption, flags)}
        <PageSelectContent {flags} hasClearSpace={true}>
            {selectedOption?.value ?? PLACEHOLDER}
        </PageSelectContent>
    {/snippet}

    {#snippet renderOption(option, flags)}
        <PageSelectOptionContent {flags}>{option.value}</PageSelectOptionContent>
    {/snippet}

    {#snippet renderClear(flags)}
        <PageSelectClear {flags} />
    {/snippet}
</Select>
