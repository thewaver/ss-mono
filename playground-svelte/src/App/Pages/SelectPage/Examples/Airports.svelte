<script lang="ts">
    import { Select } from "@thewaver/ss-components-svelte";

    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { AIRPORTS, PLACEHOLDER, renderSelectPopup } from "../SelectPage.const.svelte";
    import type { SelectAirportExampleProps } from "../SelectPage.types";

    type Props = SelectAirportExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<Select bind:value options={AIRPORTS} ariaLabel={"Airport"} renderPopup={renderSelectPopup}>
    {#snippet renderContent(selectedOption, flags)}
        <PageSelectContent {flags}>
            {selectedOption ? selectedOption.value.city : PLACEHOLDER}
        </PageSelectContent>
    {/snippet}

    {#snippet renderOption(option, flags)}
        <PageSelectOptionContent {flags}>
            {option.value.city} ({option.value.code})
        </PageSelectOptionContent>
    {/snippet}
</Select>
