<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ListboxSurface/ListboxSurface.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { ListboxSurfaceProps } from "./ListboxSurface.types";

    let props: ListboxSurfaceProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.listboxSurface, layerClass, props.isWide === true && styles.listboxSurfaceWide]}>
    {@render props.children?.()}
</div>
