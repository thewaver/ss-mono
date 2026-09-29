<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/FlipCardContent/FlipCardContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { FlipCardFaceProps } from "./FlipCardContent.types";

    let props: FlipCardFaceProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.flipCardFront, layerClass]}>
    <div class={styles.flipCardTitle}>{@render props.children?.()}</div>
    <div class={styles.flipCardBody}>{props.state.isShowing ? "facing you" : "turned away"}</div>
</div>
