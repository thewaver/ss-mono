<script lang="ts">
    import { Tooltip } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
    import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";

    let anchorRef = $state<HTMLElement | null>(null);
</script>

<div class={styles.anchorRow}>
    <button id={"publish"} bind:this={anchorRef} type={"button"} class={styles.anchorButton}>Publish</button>

    <Tooltip
        anchorRef={anchorRef ?? undefined}
        placement={{ x: "center", y: "top_out" }}
        offset={{ x: 0, y: 10 }}
        hoverShowDelayMs={TOOLTIP_HOVER_DELAY_MS}
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
