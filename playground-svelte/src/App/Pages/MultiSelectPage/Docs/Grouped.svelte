<script lang="ts">
    import { MultiSelect, SelectUtils } from "@thewaver/ss-components-svelte";
    import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.svelte";
    import PageSelectContent, {
        computePageSelectTextStyle,
    } from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectGroupContent from "../../../StyledComponents/SelectGroupContent/SelectGroupContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { GROUPED_COUNTRIES, PLACEHOLDER, QUERY_PADDING } from "../../SelectPage/SelectPage.const.svelte";

    let values = $state<string[]>([]);
    let query = $state("");

    const options = $derived.by(() => {
        const needle = query.toLocaleLowerCase();

        if (!needle) return GROUPED_COUNTRIES;

        return GROUPED_COUNTRIES.map((item) =>
            SelectUtils.getIsGroup(item)
                ? {
                      ...item,
                      options: item.options.filter((option) => option.value.toLocaleLowerCase().includes(needle)),
                  }
                : item,
        ).filter((item) =>
            SelectUtils.getIsGroup(item) ? item.options.length > 0 : item.value.toLocaleLowerCase().includes(needle),
        );
    });
</script>

<MultiSelect
    renderHighlightFloater={renderPageHighlightFloater}
    bind:values
    bind:query
    {options}
    ariaLabel={"Countries"}
    padding={QUERY_PADDING}
    computeTextStyle={computePageSelectTextStyle}
>
    {#snippet renderContent(selectedOptions, flags)}
        <PageSelectContent {flags}>
            {selectedOptions.length ? `${selectedOptions.length} selected` : PLACEHOLDER}
        </PageSelectContent>
    {/snippet}

    {#snippet renderGroupHeader(group, flags)}
        <PageSelectGroupContent {flags}>{group.label}</PageSelectGroupContent>
    {/snippet}

    {#snippet renderOption(option, flags)}
        <PageSelectOptionContent isGliding {flags}>{option.value}</PageSelectOptionContent>
    {/snippet}

    {#snippet renderPopup(renderOptions, visibilityTarget, transitionDurationMs, placement)}
        <PagePopoverSurface {visibilityTarget} {transitionDurationMs} {placement}>
            {#if options.length}
                {@render renderOptions()}
            {:else}
                <div class={popupStyles.popoverSurfaceEmpty}>No country matches that</div>
            {/if}
        </PagePopoverSurface>
    {/snippet}
</MultiSelect>
