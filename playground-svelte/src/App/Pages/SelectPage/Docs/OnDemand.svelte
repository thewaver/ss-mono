<script lang="ts">
    import { Select } from "@thewaver/ss-components-svelte";
    import type { SelectOption } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { PAGED_TOTAL } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.const";
    import type { Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";
    import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { PLACEHOLDER, fetchRoutes } from "../SelectPage.const.svelte";

    let value = $state.raw<Delivery | undefined>();
    let routes = $state.raw<SelectOption<Delivery>[]>([]);
    let isFetching = $state(false);

    const fetchNext = async () => {
        if (isFetching) return;

        isFetching = true;

        const page = await fetchRoutes(routes.length);

        routes = [...routes, ...page];
        isFetching = false;
    };
</script>

<Select
    renderHighlightFloater={renderPageHighlightFloater}
    bind:value
    options={routes}
    hasMoreOptions={routes.length < PAGED_TOTAL}
    ariaLabel={"Route"}
    onReachEnd={() => void fetchNext()}
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

            {#if isFetching}
                <div class={popupStyles.popoverSurfaceEmpty}>Fetching more routes…</div>
            {/if}
        </PagePopoverSurface>
    {/snippet}
</Select>

<div class={exampleStyles.exampleReadout} data-readout>
    {`${routes.length} of ${PAGED_TOTAL} routes fetched${isFetching ? ", more on the way" : ""}`}
</div>
