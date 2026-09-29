<script lang="ts">
    import { Label, Select } from "@thewaver/ss-components-svelte";

    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../SelectPage.const.svelte";
    import type { SelectExampleProps } from "../SelectPage.types";

    const LABEL_GAP = 5;

    type Props = SelectExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<Label orientation={"vertical"} gap={LABEL_GAP}>
    <PageLabelCaption>Country</PageLabelCaption>

    <Select bind:value options={COUNTRIES} listAriaLabel={"Country"} renderPopup={renderSelectPopup}>
        {#snippet renderContent(selectedOption, flags)}
            <PageSelectContent {flags}>{selectedOption?.value ?? PLACEHOLDER}</PageSelectContent>
        {/snippet}

        {#snippet renderOption(option, flags)}
            <PageSelectOptionContent {flags}>{option.value}</PageSelectOptionContent>
        {/snippet}
    </Select>
</Label>
