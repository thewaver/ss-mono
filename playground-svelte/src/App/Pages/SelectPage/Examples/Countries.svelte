<script lang="ts">
    import type { Snippet } from "svelte";

    import { Select, type SelectOptionGroup } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectGroupBox from "../../../StyledComponents/SelectGroupContent/PageSelectGroupBox.svelte";
    import PageSelectGroupContent from "../../../StyledComponents/SelectGroupContent/SelectGroupContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../SelectPage.const.svelte";
    import type { SelectExampleProps } from "../SelectPage.types";

    type Props = SelectExampleProps & {
        isDisabled?: boolean;
        hasError?: boolean;
        hasGroups?: boolean;
        hasGroupBoxes?: boolean;
    };

    let { value = $bindable(), ...props }: Props = $props();
</script>

<Select
    renderHighlightFloater={renderPageHighlightFloater}
    bind:value
    options={props.options ?? COUNTRIES}
    isDisabled={props.isDisabled}
    hasError={props.hasError}
    ariaLabel={"Country"}
    renderGroupHeader={props.hasGroups ? groupLabel : undefined}
    renderGroupBox={props.hasGroupBoxes ? groupBox : undefined}
    renderPopup={renderSelectPopup}
>
    {#snippet renderContent(selectedOption, flags)}
        <PageSelectContent {flags}>{selectedOption?.value ?? PLACEHOLDER}</PageSelectContent>
    {/snippet}

    {#snippet renderOption(option, flags)}
        <PageSelectOptionContent isGliding {flags}>{option.value}</PageSelectOptionContent>
    {/snippet}
</Select>

{#snippet groupBox(renderContent: Snippet)}
    <PageSelectGroupBox>{@render renderContent()}</PageSelectGroupBox>
{/snippet}

{#snippet groupLabel(group: SelectOptionGroup<string>)}
    <PageSelectGroupContent>{group.label}</PageSelectGroupContent>
{/snippet}
