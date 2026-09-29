<script lang="ts">
    import { Corners } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/CornersPage/CornersPage.css";

    import type { CornersExampleProps } from "../CornersPage.types";

    type Props = CornersExampleProps;

    let props: Props = $props();
</script>

<div class={styles.frame}>
    <Corners
        color={props.color}
        cornerLength={props.cornerLength}
        strokeThickness={props.strokeThickness}
        transitionDurationMs={props.transitionDurationMs}
        visibleCorners={props.visibleCorners}
    >
        <div class={styles.frameBody}>Whatever it is put around</div>
    </Corners>
</div>
