<script lang="ts">
    import { Button, Scroller } from "@thewaver/ss-components-svelte";
    import type { ScrollerController } from "@thewaver/ss-components-svelte";
    import { ITEM_LABELS } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
    import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

    import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.svelte";
    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";

    let controller = $state<ScrollerController>();
</script>

<div class={styles.stripLayout}>
    <PageScrollerButton id={"focusableChildrenBack"} {controller} step={"previous"} />

    <div class={styles.scrollerCell}>
        <Scroller
            padding={FOCUS_RING_WIDTH}
            onMount={(next) => {
                controller = next;
            }}
        >
            {#each ITEM_LABELS as label (label)}
                <div class={styles.item}>
                    <Button>
                        {#snippet renderContent(flags)}
                            <PageButtonContent {flags}>{label}</PageButtonContent>
                        {/snippet}
                    </Button>
                </div>
            {/each}
        </Scroller>
    </div>

    <PageScrollerButton id={"focusableChildrenForward"} {controller} step={"next"} />
</div>
