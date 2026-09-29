<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/NavMenuContent/NavMenuContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { NavMenuTriggerProps } from "./NavMenuContent.types";

    let props: NavMenuTriggerProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<span
    class={[
        styles.navMenuTrigger,
        layerClass,
        props.flags.isHovered && styles.isHovered,
        props.flags.isOpen && styles.isOpen,
    ]}
>
    {@render props.children?.()}<span class={styles.navMenuChevron} aria-hidden="true">{"▾"}</span>
</span>
