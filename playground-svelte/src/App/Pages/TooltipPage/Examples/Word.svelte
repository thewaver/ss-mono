<script lang="ts">
    import { Tooltip } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";

    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { TooltipExampleProps } from "../TooltipPage.types";

    type Props = TooltipExampleProps;

    let props: Props = $props();

    let anchorRef = $state<HTMLElement | null>(null);
</script>

<div class={styles.sentence}>
    The keep was raised by masons paid in
    <span bind:this={anchorRef} class={styles.anchorWord} tabindex={0}>marks</span>
    rather than in coin, which is why the accounts survive at all.<Tooltip
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
                A weight of silver, not a coin — eight ounces, counted rather than struck.
            </PageTooltipContent>
        {/snippet}
    </Tooltip>
</div>
