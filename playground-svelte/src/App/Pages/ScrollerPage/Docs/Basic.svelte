<script lang="ts">
    import { Scroller } from "@thewaver/ss-components-svelte";
    import type { ScrollerController } from "@thewaver/ss-components-svelte";
    import { toItemLabels } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
    import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

    import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.svelte";
    import type { ScrollerBasicDocsExampleProps } from "../ScrollerPageSvelte.types";

    type Props = ScrollerBasicDocsExampleProps;

    let props: Props = $props();

    let controller = $state<ScrollerController>();
</script>

<div class={styles.stripLayout}>
    <PageScrollerButton id={"basicBack"} {controller} step={"previous"} />

    <div class={styles.scrollerCell}>
        <Scroller
            padding={FOCUS_RING_WIDTH}
            overlapCount={props.overlapCount}
            onMount={(next) => {
                controller = next;
            }}
        >
            {#each toItemLabels(props.itemCount) as label (label)}
                <div class={styles.chip}>{label}</div>
            {/each}
        </Scroller>
    </div>

    <PageScrollerButton id={"basicForward"} {controller} step={"next"} />
</div>
