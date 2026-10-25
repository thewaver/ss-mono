<script lang="ts">
    import { Range } from "@thewaver/ss-components-svelte";
    import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

    import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { RangeTooltipDocsExampleProps } from "../RangePageSvelte.types";

    type Props = RangeTooltipDocsExampleProps;

    let props: Props = $props();

    let value = $state(75);
</script>

<Range
    bind:value
    id={"tooltipVolume"}
    ariaLabel={"Disabled but reachable range"}
    isDisabled={props.isDisabled}
    isReachableWhenDisabled={props.isReachableWhenDisabled}
    thumbSize={RANGE_THUMB_SIZE}
    tooltipDefs={{
        placement: { x: "center", y: "top_out" },
        offset: { x: 0, y: 10 },
        renderContent: tooltip,
    }}
>
    {#snippet renderContent(renderProps)}
        <PageRangeContent {renderProps} />
    {/snippet}
</Range>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        Focusable so this tooltip can be read, but arrow keys and dragging must leave the value where it is.
    </PageTooltipContent>
{/snippet}
