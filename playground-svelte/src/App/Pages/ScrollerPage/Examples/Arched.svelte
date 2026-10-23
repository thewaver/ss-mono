<script lang="ts">
    import { Scroller } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
    import { ScrollerArcContentUtils } from "@thewaver/ss-playground/App/StyledComponents/ScrollerArcContent/ScrollerArcContent.utils";
    import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

    import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.svelte";
    import PageScrollerArcContent from "../../../StyledComponents/ScrollerArcContent/ScrollerArcContent.svelte";
    import type { ScrollerExampleProps } from "../ScrollerPageSvelte.types";

    const SCROLLER_GAP = 10;

    type Props = ScrollerExampleProps;

    let props: Props = $props();
</script>

<div class={styles.demo}>
    <Scroller
        gap={SCROLLER_GAP}
        barSideX={"start"}
        padding={FOCUS_RING_WIDTH}
        overlapCount={props.overlapCount}
        computeProgressAtPoint={ScrollerArcContentUtils.computeProgressAtPoint}
    >
        {#snippet renderButton(step, stepper, axis)}
            <PageScrollerButton {step} {stepper} {axis} />
        {/snippet}

        {#snippet renderBar(renderProps, refs)}
            <PageScrollerArcContent {renderProps} {refs} />
        {/snippet}

        {#each props.labels as label (label)}
            <div class={styles.chip}>{label}</div>
        {/each}
    </Scroller>
</div>
