<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PopoverSurfaceProps } from "./PopoverSurface.types";

    let props: PopoverSurfaceProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.popoverSurface,
        layerClass,
        props.visibilityTarget === 1 && styles.isVisible,
        props.placement.y === "top-out" && styles.isFlipped,
    ]}
    style:transition={`opacity ${props.transitionDurationMs}ms, transform ${props.transitionDurationMs}ms`}
>
    {@render props.children?.()}
</div>
