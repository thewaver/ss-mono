<script lang="ts">
    import type { Snippet } from "svelte";

    import { Tooltip } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.css";
    import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";

    const TOOLTIP_PLACEMENT = { x: "center", y: "top-out" } as const;
    const TOOLTIP_OFFSET = { x: 0, y: 10 };

    type TermProps = {
        tip: string;
    };

    let props: TermProps & { children?: Snippet } = $props();

    let anchorRef = $state<HTMLElement>();
</script>

<span>
    <span bind:this={anchorRef} class={styles.glossaryTerm} tabindex={0}>{@render props.children?.()}</span><Tooltip
        {anchorRef}
        placement={TOOLTIP_PLACEMENT}
        offset={TOOLTIP_OFFSET}
        hoverShowDelayMs={TOOLTIP_HOVER_DELAY_MS}
    >
        {#snippet renderContent(visibilityTarget, transitionDurationMs)}
            <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
                {props.tip}
            </PageTooltipContent>
        {/snippet}
    </Tooltip>
</span>
