<script lang="ts">
    import { Scroller } from "@thewaver/ss-components-svelte";
    import type { ScrollerController } from "@thewaver/ss-components-svelte";
    import { ITEM_LABELS } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
    import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

    import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.svelte";
    import PageScrollerBarContent from "../../../StyledComponents/ScrollerBarContent/ScrollerBarContent.svelte";

    let controller = $state<ScrollerController>();
</script>

<div class={styles.stripLayout} dir={"rtl"}>
    <PageScrollerButton id={"rightToLeftBack"} {controller} step={"previous"} />

    <div class={styles.scrollerCell}>
        <Scroller
            padding={FOCUS_RING_WIDTH}
            onMount={(next) => {
                controller = next;
            }}
        >
            {#snippet renderBar(renderProps, refs)}
                <PageScrollerBarContent {renderProps} {refs} />
            {/snippet}

            {#each ITEM_LABELS as label (label)}
                <div class={styles.chip}>{label}</div>
            {/each}
        </Scroller>
    </div>

    <PageScrollerButton id={"rightToLeftForward"} {controller} step={"next"} />
</div>
