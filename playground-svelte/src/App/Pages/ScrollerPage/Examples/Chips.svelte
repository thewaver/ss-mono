<script lang="ts">
    import { Scroller, ScrollerUtils } from "@thewaver/ss-components-svelte";
    import type { ScrollerButtonPlacement, ScrollerProgress } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
    import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

    import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.svelte";
    import type { ScrollerExampleProps } from "../ScrollerPageSvelte.types";

    const SCROLLER_GAP = 10;

    type Props = ScrollerExampleProps & {
        buttonPlacement?: ScrollerButtonPlacement;
        progress?: ScrollerProgress;
    };

    let { progress = $bindable(ScrollerUtils.NO_PROGRESS), ...props }: Props = $props();
</script>

<div class={styles.demo}>
    <Scroller gap={SCROLLER_GAP} padding={FOCUS_RING_WIDTH} overlapCount={props.overlapCount} buttonPlacement={props.buttonPlacement} bind:progress>
        {#snippet renderButton(step, stepper)}
            <PageScrollerButton {step} {stepper} />
        {/snippet}

        {#each props.labels as label (label)}
            <div class={styles.chip}>{label}</div>
        {/each}
    </Scroller>
</div>
