<script module lang="ts">
    import PageGlideFloater from "./PageGlideFloater.svelte";

    export { renderPageHighlightFloater, renderPageSelectionFloater };
</script>

{#snippet renderPageHighlightFloater(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageGlideFloater kind={"highlight"} {visibilityTarget} {transitionDurationMs} />
{/snippet}

{#snippet renderPageSelectionFloater(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageGlideFloater kind={"selection"} {visibilityTarget} {transitionDurationMs} />
{/snippet}
