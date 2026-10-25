<script lang="ts">
    import { Scroller } from "@thewaver/ss-components-svelte";
    import type { ScrollerController } from "@thewaver/ss-components-svelte";
    import { ITEM_LABELS } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
    import { ScrollerArcContentUtils } from "@thewaver/ss-playground/App/StyledComponents/ScrollerArcContent/ScrollerArcContent.utils";
    import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

    import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.svelte";
    import PageScrollerArcContent from "../../../StyledComponents/ScrollerArcContent/ScrollerArcContent.svelte";

    let controller = $state<ScrollerController>();
</script>

<div class={styles.stripLayout}>
    <PageScrollerButton id={"archedBack"} {controller} step={"previous"} />

    <div class={styles.scrollerCell}>
        <Scroller
            padding={FOCUS_RING_WIDTH}
            barSideX={"start"}
            computeProgressAtPoint={ScrollerArcContentUtils.computeProgressAtPoint}
            onMount={(next) => {
                controller = next;
            }}
        >
            {#snippet renderBar(renderProps, refs)}
                <PageScrollerArcContent {renderProps} {refs} />
            {/snippet}

            {#each ITEM_LABELS as label (label)}
                <div class={styles.chip}>{label}</div>
            {/each}
        </Scroller>
    </div>

    <PageScrollerButton id={"archedForward"} {controller} step={"next"} />
</div>
