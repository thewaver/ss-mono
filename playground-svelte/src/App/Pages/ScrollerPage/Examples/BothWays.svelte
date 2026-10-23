<script lang="ts">
    import { Scroller } from "@thewaver/ss-components-svelte";
    import { GRID_SIZE, getGridCellLabel } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
    import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

    import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.svelte";
    import PageScrollerBarContent from "../../../StyledComponents/ScrollerBarContent/ScrollerBarContent.svelte";
    import type { ScrollerExampleProps } from "../ScrollerPageSvelte.types";

    const SCROLLER_GAP = 10;
    const INDICES = Array.from({ length: GRID_SIZE }, (_, index) => index);

    type Props = ScrollerExampleProps;

    let props: Props = $props();
</script>

<div class={styles.bothWaysDemo}>
    <Scroller
        gap={SCROLLER_GAP}
        padding={FOCUS_RING_WIDTH}
        overflowX={props.overflowX}
        overflowY={props.overflowY}
        isAutoHiding={props.isAutoHiding}
        hideDelayMs={props.hideDelayMs}
        isBarOverlaid={props.isBarOverlaid}
    >
        {#snippet renderButton(step, stepper, axis)}
            <PageScrollerButton {step} {stepper} {axis} />
        {/snippet}

        {#snippet renderBar(renderProps, refs)}
            <PageScrollerBarContent {renderProps} {refs} />
        {/snippet}

        <div class={styles.cellGrid}>
            {#each INDICES as row (row)}
                {#each INDICES as column (column)}
                    <div class={styles.chip}>{getGridCellLabel(row, column)}</div>
                {/each}
            {/each}
        </div>
    </Scroller>
</div>
