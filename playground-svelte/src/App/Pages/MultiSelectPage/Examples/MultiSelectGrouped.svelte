<script lang="ts">
    import type { Snippet } from "svelte";

    import { MultiSelect } from "@thewaver/ss-components-svelte";
    import type { AnchorPlacement, SelectItem } from "@thewaver/ss-components-svelte";
    import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

    import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.svelte";
    import PageSelectContent, {
        computePageSelectTextStyle,
    } from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectGroupContent from "../../../StyledComponents/SelectGroupContent/SelectGroupContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { PLACEHOLDER, QUERY_PADDING } from "../../SelectPage/SelectPage.const.svelte";

    type Props = {
        values: string[];
        query: string;
        options: SelectItem<string>[];
    };

    let { values = $bindable(), query = $bindable(), ...props }: Props = $props();
</script>

<MultiSelect
    bind:values
    bind:query
    options={props.options}
    ariaLabel={"Countries"}
    padding={QUERY_PADDING}
    computeTextStyle={computePageSelectTextStyle}
    renderPopup={groupedPopup}
>
    {#snippet renderContent(selectedOptions, flags)}
        <PageSelectContent {flags}>
            {selectedOptions.length ? `${selectedOptions.length} selected` : PLACEHOLDER}
        </PageSelectContent>
    {/snippet}

    {#snippet renderGroup(group, flags)}
        <PageSelectGroupContent {flags}>{group.label}</PageSelectGroupContent>
    {/snippet}

    {#snippet renderOption(option, flags)}
        <PageSelectOptionContent {flags}>{option.value}</PageSelectOptionContent>
    {/snippet}
</MultiSelect>

{#snippet groupedPopup(
    renderOptions: Snippet,
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
    placement: AnchorPlacement,
)}
    <PagePopoverSurface {visibilityTarget} {transitionDurationMs} {placement}>
        {#if props.options.length}
            {@render renderOptions()}
        {:else}
            <div class={popupStyles.popoverSurfaceEmpty}>No country matches that</div>
        {/if}
    </PagePopoverSurface>
{/snippet}
