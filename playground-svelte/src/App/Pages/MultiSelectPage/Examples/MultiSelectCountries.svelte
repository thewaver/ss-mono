<script lang="ts">
    import { MultiSelect } from "@thewaver/ss-components-svelte";

    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../../SelectPage/SelectPage.const.svelte";

    type Props = {
        values: string[];
    };

    let { values = $bindable() }: Props = $props();
</script>

<MultiSelect bind:values options={COUNTRIES} ariaLabel={"Countries"} renderPopup={renderSelectPopup}>
    {#snippet renderContent(selectedOptions, flags)}
        <PageSelectContent {flags}>
            {selectedOptions.length ? selectedOptions.map((option) => option.value).join(", ") : PLACEHOLDER}
        </PageSelectContent>
    {/snippet}

    {#snippet renderOption(option, flags)}
        <PageSelectOptionContent {flags}>{option.value}</PageSelectOptionContent>
    {/snippet}
</MultiSelect>
