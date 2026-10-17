<script lang="ts">
    import { CornerHighlight } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/CornerHighlightPage/CornerHighlightPage.css";

    import type { CornerHighlightExampleProps } from "../CornerHighlightPageSvelte.types";

    type Props = CornerHighlightExampleProps;

    let props: Props = $props();
</script>

<div class={styles.frame}>
    <CornerHighlight
        color={props.color}
        cornerLength={props.cornerLength}
        strokeThickness={props.strokeThickness}
        transitionDurationMs={props.transitionDurationMs}
        visibleCorners={props.visibleCorners}
    >
        <div class={styles.frameBody}>Whatever it is put around</div>
    </CornerHighlight>
</div>
