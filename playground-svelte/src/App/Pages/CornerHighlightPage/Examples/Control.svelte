<script lang="ts">
    import { Button, CornerHighlight } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/CornerHighlightPage/CornerHighlightPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { CornerHighlightExampleProps } from "../CornerHighlightPageSvelte.types";

    type Props = CornerHighlightExampleProps;

    const TRANSPARENT = "transparent";

    let props: Props = $props();

    let isArmed = $state(false);
</script>

<div class={styles.controlRow}>
    <Button
        isPressed={isArmed}
        onClick={() => {
            isArmed = !isArmed;
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>{isArmed ? "Armed" : "Arm"}</PageButtonContent>
        {/snippet}

        {#snippet renderDecoration(flags)}
            <CornerHighlight
                color={flags.isPressed ? props.color : TRANSPARENT}
                cornerLength={props.cornerLength}
                strokeThickness={props.strokeThickness}
                transitionDurationMs={props.transitionDurationMs}
                visibleCorners={props.visibleCorners}
            />
        {/snippet}
    </Button>
</div>
