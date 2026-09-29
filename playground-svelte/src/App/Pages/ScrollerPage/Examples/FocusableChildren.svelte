<script lang="ts">
    import { Button, Scroller } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
    import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

    import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.svelte";
    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { ScrollerExampleProps } from "../ScrollerPage.types";

    const SCROLLER_GAP = 10;

    type Props = ScrollerExampleProps;

    let props: Props = $props();
</script>

<div class={styles.demo}>
    <Scroller gap={SCROLLER_GAP} padding={FOCUS_RING_WIDTH}>
        {#snippet renderButton(step, stepper)}
            <PageScrollerButton {step} {stepper} />
        {/snippet}

        {#each props.labels as label (label)}
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
