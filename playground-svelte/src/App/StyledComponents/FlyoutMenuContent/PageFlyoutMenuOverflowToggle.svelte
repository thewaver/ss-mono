<script lang="ts">
    import type { Snippet } from "svelte";

    import { FLYOUT_MENU_CHEVRON } from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.const";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { FlyoutMenuToggleProps } from "./FlyoutMenuContentSvelte.types";

    let props: FlyoutMenuToggleProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<span
    class={[
        styles.flyoutMenuOverflowToggle,
        layerClass,
        props.flags.isHovered && styles.isHovered,
        props.flags.isOpen && styles.isOpen,
    ]}
>
    {@render props.children?.()}

    <span class={styles.flyoutMenuChevron} aria-hidden="true">{FLYOUT_MENU_CHEVRON}</span>
</span>
