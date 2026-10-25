<script lang="ts">
    import { untrack } from "svelte";

    import { Select } from "@thewaver/ss-components-svelte";
    import type { SelectOption } from "@thewaver/ss-components-svelte";
    import type { Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";
    import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.svelte";
    import PageSelectContent, {
        computePageSelectTextStyle,
    } from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { PLACEHOLDER, QUERY_PADDING, searchRoutes } from "../SelectPage.const.svelte";

    let value = $state.raw<Delivery | undefined>();
    let query = $state("");
    let results = $state.raw<SelectOption<Delivery>[]>([]);
    let total = $state(0);
    let isSearching = $state(false);

    let latestRequest = 0;

    const search = async (offset: number) => {
        const request = ++latestRequest;

        isSearching = true;

        const page = await searchRoutes(query, offset);

        if (request !== latestRequest) return;

        results = offset > 0 ? [...results, ...page.items] : page.items;
        total = page.total;
        isSearching = false;
    };

    $effect(() => {
        void query;

        untrack(() => {
            results = [];
            total = 0;

            void search(0);
        });
    });
</script>

<Select
    renderHighlightFloater={renderPageHighlightFloater}
    bind:value
    bind:query
    options={results}
    hasMoreOptions={results.length < total || isSearching}
    ariaLabel={"Route"}
    padding={QUERY_PADDING}
    computeTextStyle={computePageSelectTextStyle}
    onReachEnd={() => {
        if (isSearching) return;

        void search(results.length);
    }}
>
    {#snippet renderContent(selectedOption, flags)}
        <PageSelectContent {flags}>{selectedOption?.value.name ?? PLACEHOLDER}</PageSelectContent>
    {/snippet}

    {#snippet renderOption(option, flags)}
        <PageSelectOptionContent isGliding {flags} description={option.value.description}>
            {option.value.name}
        </PageSelectOptionContent>
    {/snippet}

    {#snippet renderPopup(renderOptions, visibilityTarget, transitionDurationMs, placement)}
        <PagePopoverSurface {visibilityTarget} {transitionDurationMs} {placement}>
            {@render renderOptions()}

            {#if isSearching}
                <div class={popupStyles.popoverSurfaceEmpty}>Searching…</div>
            {/if}

            {#if !isSearching && total < 1}
                <div class={popupStyles.popoverSurfaceEmpty}>No route matches that</div>
            {/if}
        </PagePopoverSurface>
    {/snippet}
</Select>
