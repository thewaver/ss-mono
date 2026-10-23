<script lang="ts">
    import { Scroller } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
    import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

    import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.svelte";
    import PageScrollerBarContent from "../../../StyledComponents/ScrollerBarContent/ScrollerBarContent.svelte";
    import type { ScrollerExampleProps } from "../ScrollerPageSvelte.types";

    const SCROLLER_GAP = 10;

    type Props = ScrollerExampleProps;

    let props: Props = $props();
</script>

<div class={styles.verticalDemo}>
    <Scroller
        gap={SCROLLER_GAP}
        padding={FOCUS_RING_WIDTH}
        overlapCount={props.overlapCount}
        overflowX={"hidden"}
        overflowY={"auto"}
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

        {#each props.labels as label (label)}
            <div class={styles.row}>{label}</div>
        {/each}
    </Scroller>
</div>
