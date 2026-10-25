<script lang="ts">
    import type { Snippet } from "svelte";

    import { Select, type SelectOptionGroup } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectGroupBox from "../../../StyledComponents/SelectGroupContent/PageSelectGroupBox.svelte";
    import PageSelectGroupContent from "../../../StyledComponents/SelectGroupContent/SelectGroupContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { GROUPED_COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../SelectPage.const.svelte";
    import type { SelectGroupsDocsExampleProps } from "../SelectPageSvelte.types";

    type Props = SelectGroupsDocsExampleProps;

    let props: Props = $props();

    let value = $state<string | undefined>();
</script>

<Select
    renderHighlightFloater={renderPageHighlightFloater}
    bind:value
    options={GROUPED_COUNTRIES}
    ariaLabel={"Country"}
    renderGroupHeader={groupHeader}
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

{#snippet groupHeader(group: SelectOptionGroup<string>)}
    <PageSelectGroupContent>{group.label}</PageSelectGroupContent>
{/snippet}

{#snippet groupBox(renderContent: Snippet)}
    <PageSelectGroupBox>{@render renderContent()}</PageSelectGroupBox>
{/snippet}
