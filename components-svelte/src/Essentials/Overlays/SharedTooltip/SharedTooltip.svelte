<script lang="ts">
    import Tooltip from "../Tooltip/Tooltip.svelte";
    import { setSharedTooltipContext } from "./SharedTooltip.context.js";
    import type { SharedTooltipClaim, SharedTooltipProps } from "./SharedTooltip.types.js";

    let props: SharedTooltipProps = $props();

    let claimed = $state.raw<SharedTooltipClaim>();

    const currentTooltipProps = $derived(claimed?.getTooltipProps());

    let lastTooltipProps: ReturnType<SharedTooltipClaim["getTooltipProps"]>;

    const tooltipProps = $derived.by(() => {
        if (!claimed) return undefined;

        if (currentTooltipProps) lastTooltipProps = currentTooltipProps;

        return lastTooltipProps;
    });

    setSharedTooltipContext({
        claim: (claim) => {
            if (claim.anchorRef !== claimed?.anchorRef) claimed = claim;
        },
        release: (anchorRef) => {
            if (anchorRef === claimed?.anchorRef) claimed = undefined;
        },
    });
</script>

{@render props.children()}

{#if tooltipProps}
    {@const { renderContent: renderClaimedContent, ...shownProps } = tooltipProps}
    <Tooltip {...shownProps} anchorRef={currentTooltipProps ? claimed?.anchorRef : undefined}>
        {#snippet renderContent(visibilityTarget, transitionDurationMs, placement, arrowAim)}
            {#key claimed}
                {@render renderClaimedContent(visibilityTarget, transitionDurationMs, placement, arrowAim)}
            {/key}
        {/snippet}
    </Tooltip>
{/if}
