<script lang="ts">
    import { Select } from "@thewaver/ss-components-svelte";

    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { DELIVERIES, PLACEHOLDER, renderSelectPopup } from "../SelectPage.const.svelte";
    import type { SelectDeliveryExampleProps } from "../SelectPage.types";

    type Props = SelectDeliveryExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<Select bind:value options={DELIVERIES} ariaLabel={"Delivery"} renderPopup={renderSelectPopup}>
    {#snippet renderContent(selectedOption, flags)}
        <PageSelectContent {flags}>{selectedOption?.value.name ?? PLACEHOLDER}</PageSelectContent>
    {/snippet}

    {#snippet renderOption(option, flags)}
        <PageSelectOptionContent {flags} description={option.value.description}>
            {option.value.name}
        </PageSelectOptionContent>
    {/snippet}
</Select>
