<script lang="ts">
    import { Button, Corners } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/CornersPage/CornersPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { CornersExampleProps } from "../CornersPage.types";

    type Props = CornersExampleProps;

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
            <Corners
                color={flags.isPressed ? props.color : TRANSPARENT}
                cornerLength={props.cornerLength}
                strokeThickness={props.strokeThickness}
                transitionDurationMs={props.transitionDurationMs}
                visibleCorners={props.visibleCorners}
            />
        {/snippet}
    </Button>
</div>
