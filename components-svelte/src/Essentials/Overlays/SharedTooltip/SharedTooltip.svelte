<script lang="ts">
    import Tooltip from "../Tooltip/Tooltip.svelte";
    import { setSharedTooltipContext } from "./SharedTooltip.context.js";
    import type { SharedTooltipClaim, SharedTooltipProps } from "./SharedTooltip.types.js";

    let props: SharedTooltipProps = $props();

    let claimed = $state.raw<SharedTooltipClaim>();

    const tooltipProps = $derived(claimed?.getTooltipProps());

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
    <Tooltip {...shownProps} anchorRef={claimed?.anchorRef}>
        {#snippet renderContent(visibilityTarget, transitionDurationMs, placement, arrowAim)}
            {#key claimed}
                {@render renderClaimedContent(visibilityTarget, transitionDurationMs, placement, arrowAim)}
            {/key}
        {/snippet}
    </Tooltip>
{/if}
