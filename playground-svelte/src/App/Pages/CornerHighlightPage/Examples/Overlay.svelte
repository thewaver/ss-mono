<script lang="ts">
    import { Button, CornerHighlight } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/CornerHighlightPage/CornerHighlightPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { CornerHighlightExampleProps } from "../CornerHighlightPageSvelte.types";

    type Props = CornerHighlightExampleProps;

    let props: Props = $props();

    let count = $state(0);
</script>

<div class={styles.panel}>
    <CornerHighlight
        color={props.color}
        cornerLength={props.cornerLength}
        strokeThickness={props.strokeThickness}
        transitionDurationMs={props.transitionDurationMs}
        visibleCorners={props.visibleCorners}
    >
        <div class={styles.panelBody}>
            <div>
                The brackets sit on a layer of their own above this text, and that layer takes no pointer and is hidden
                from a screen reader.
            </div>

            <Button
                onClick={() => {
                    count += 1;
                }}
            >
                {#snippet renderContent(flags)}
                    <PageButtonContent {flags}>{`Pressed ${count}`}</PageButtonContent>
                {/snippet}
            </Button>
        </div>
    </CornerHighlight>
</div>
