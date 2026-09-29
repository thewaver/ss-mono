<script module lang="ts">
    import type { Snippet } from "svelte";

    import type { AnchorPlacement, SelectOption } from "@thewaver/ss-components-svelte";

    import PagePopoverSurface from "../../StyledComponents/PopoverSurface/PopoverSurface.svelte";
    import PageTooltipContent from "../../StyledComponents/TooltipContent/TooltipContent.svelte";

    export * from "@thewaver/ss-playground/App/Pages/SelectPage/SelectOptions.const";

    export const COUNTRIES_WITH_REACHABLE: SelectOption<string>[] = [
        { value: "Belgium" },
        {
            value: "Denmark",
            isDisabled: true,
            isReachableWhenDisabled: true,
            tooltipDefs: {
                placement: { x: "right-out", y: "center" },
                offset: { x: 10, y: 0 },
                renderContent: denmarkTooltip,
            },
        },
        { value: "Estonia" },
        {
            value: "Finland",
            isDisabled: true,
            isReachableWhenDisabled: true,
            tooltipDefs: {
                placement: { x: "right-out", y: "center" },
                offset: { x: 10, y: 0 },
                renderContent: finlandTooltip,
            },
        },
        { value: "Portugal" },
        { value: "Sweden" },
    ];

    export { renderSelectPopup };
</script>

{#snippet denmarkTooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        Not shipping here until the new depot opens.
    </PageTooltipContent>
{/snippet}

{#snippet finlandTooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        Out of stock for the rest of the quarter.
    </PageTooltipContent>
{/snippet}

{#snippet renderSelectPopup(
    renderOptions: Snippet,
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
    placement: AnchorPlacement,
)}
    <PagePopoverSurface {visibilityTarget} {transitionDurationMs} {placement}>
        {@render renderOptions()}
    </PagePopoverSurface>
{/snippet}
