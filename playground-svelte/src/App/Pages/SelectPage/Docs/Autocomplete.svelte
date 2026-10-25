<script lang="ts">
    import { Select } from "@thewaver/ss-components-svelte";
    import type { Airport } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";
    import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.svelte";
    import PageSelectContent, {
        computePageSelectTextStyle,
    } from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { AIRPORTS, PLACEHOLDER, QUERY_PADDING } from "../SelectPage.const.svelte";

    let value = $state.raw<Airport | undefined>();
    let query = $state("");

    const options = $derived.by(() => {
        const needle = query.toLocaleLowerCase();

        if (!needle) return AIRPORTS;

        return AIRPORTS.filter(
            (option) =>
                option.value.city.toLocaleLowerCase().includes(needle) ||
                option.value.code.toLocaleLowerCase().includes(needle),
        );
    });
</script>

<Select
    renderHighlightFloater={renderPageHighlightFloater}
    bind:value
    bind:query
    {options}
    ariaLabel={"Airport"}
    padding={QUERY_PADDING}
    computeTextStyle={computePageSelectTextStyle}
>
    {#snippet renderContent(selectedOption, flags)}
        <PageSelectContent {flags}>{selectedOption?.value.city ?? PLACEHOLDER}</PageSelectContent>
    {/snippet}

    {#snippet renderOption(option, flags)}
        <PageSelectOptionContent isGliding {flags}>
            {option.value.city} ({option.value.code})
        </PageSelectOptionContent>
    {/snippet}

    {#snippet renderPopup(renderOptions, visibilityTarget, transitionDurationMs, placement)}
        <PagePopoverSurface {visibilityTarget} {transitionDurationMs} {placement}>
            {#if options.length}
                {@render renderOptions()}
            {:else}
                <div class={popupStyles.popoverSurfaceEmpty}>No airport matches that</div>
            {/if}
        </PagePopoverSurface>
    {/snippet}
</Select>
