<script lang="ts">
    import { Scroller } from "@thewaver/ss-components-svelte";
    import type { ScrollerController } from "@thewaver/ss-components-svelte";
    import { GRID_SIZE, getGridCellLabel } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
    import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

    import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.svelte";
    import PageScrollerBarContent from "../../../StyledComponents/ScrollerBarContent/ScrollerBarContent.svelte";
    import type { ScrollerBothWaysDocsExampleProps } from "../ScrollerPageSvelte.types";

    const INDICES = Array.from({ length: GRID_SIZE }, (_, index) => index);

    type Props = ScrollerBothWaysDocsExampleProps;

    let props: Props = $props();

    let controller = $state<ScrollerController>();
</script>

<div class={styles.bothWaysLayout}>
    <div class={styles.bothWaysCell.up}>
        <PageScrollerButton id={"bothWaysUp"} {controller} step={"previous"} axis={"y"} />
    </div>

    <div class={styles.bothWaysCell.back}>
        <PageScrollerButton id={"bothWaysBack"} {controller} step={"previous"} axis={"x"} />
    </div>

    <div class={styles.bothWaysCell.box}>
        <Scroller
            padding={FOCUS_RING_WIDTH}
            overflowX={props.overflowX}
            overflowY={props.overflowY}
            onMount={(next) => {
                controller = next;
            }}
        >
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

    <div class={styles.bothWaysCell.next}>
        <PageScrollerButton id={"bothWaysForward"} {controller} step={"next"} axis={"x"} />
    </div>

    <div class={styles.bothWaysCell.down}>
        <PageScrollerButton id={"bothWaysDown"} {controller} step={"next"} axis={"y"} />
    </div>
</div>
