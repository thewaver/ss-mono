<script lang="ts">
    import { Tooltip } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
    import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";

    let anchorRef = $state<HTMLElement | null>(null);
</script>

<div class={styles.sentence}>
    The keep was raised by masons paid in
    <span id={"marks"} bind:this={anchorRef} class={styles.anchorWord} tabindex={0}>marks</span>
    rather than in coin, which is why the accounts survive at all.<Tooltip
        anchorRef={anchorRef ?? undefined}
        placement={{ x: "center", y: "top_out" }}
        offset={{ x: 0, y: 10 }}
        hoverShowDelayMs={TOOLTIP_HOVER_DELAY_MS}
    >
        {#snippet renderContent(visibilityTarget, transitionDurationMs)}
            <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
                A weight of silver, not a coin — eight ounces, counted rather than struck.
            </PageTooltipContent>
        {/snippet}
    </Tooltip>
</div>
