<script lang="ts">
    import { Tooltip } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";

    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { TooltipExampleProps } from "../TooltipPage.types";

    type Props = TooltipExampleProps;

    let props: Props = $props();

    let anchorRef = $state<HTMLElement | null>(null);
</script>

<div class={styles.anchorRow}>
    <button bind:this={anchorRef} type={"button"} class={styles.anchorButton}>Archive</button>

    <Tooltip
        anchorRef={anchorRef ?? undefined}
        placement={props.placement}
        offset={props.offset}
        transitionDurationMs={props.transitionDurationMs}
        focusShowDelayMs={props.focusShowDelayMs}
        hoverShowDelayMs={props.hoverShowDelayMs}
        skipDelayWindowMs={props.skipDelayWindowMs}
    >
        {#snippet renderContent(visibilityTarget, transitionDurationMs, _placement, arrowAim)}
            <PageTooltipContent
                {visibilityTarget}
                {transitionDurationMs}
                reveal={props.reveal}
                arrow={props.arrow}
                arrowWidth={props.arrowWidth}
                arrowLength={props.arrowLength}
                {arrowAim}
            >
                Moves the thread out of the inbox.
            </PageTooltipContent>
        {/snippet}
    </Tooltip>
</div>
