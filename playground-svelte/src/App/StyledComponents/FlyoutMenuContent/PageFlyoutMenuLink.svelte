<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { FlyoutMenuLinkProps } from "./FlyoutMenuContentSvelte.types";

    let props: FlyoutMenuLinkProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<span
    class={[
        styles.flyoutMenuLink,
        layerClass,
        props.flags.isCurrent && styles.isCurrent,
    ]}
>
    {@render props.children?.()}
</span>
