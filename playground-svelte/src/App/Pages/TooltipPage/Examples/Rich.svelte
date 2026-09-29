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
    <button bind:this={anchorRef} type={"button"} class={styles.anchorButton}>Publish</button>

    <Tooltip
        anchorRef={anchorRef ?? undefined}
        placement={props.placement}
        offset={props.offset}
        transitionDurationMs={props.transitionDurationMs}
        focusShowDelayMs={props.focusShowDelayMs}
        hoverShowDelayMs={props.hoverShowDelayMs}
        skipDelayWindowMs={props.skipDelayWindowMs}
    >
        {#snippet renderContent(visibilityTarget, transitionDurationMs)}
            <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
                <div class={styles.richTitle}>Everyone with the link</div>

                <div class={styles.richBody}>
                    The page stays private until you share it. Publishing does not send anything to anybody; it only
                    stops the page refusing visitors.
                </div>
            </PageTooltipContent>
        {/snippet}
    </Tooltip>
</div>
