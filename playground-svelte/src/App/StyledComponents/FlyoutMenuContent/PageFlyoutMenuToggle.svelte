<script lang="ts">
    import { FLYOUT_MENU_CHEVRON } from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.const";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { FlyoutMenuToggleProps } from "./FlyoutMenuContentSvelte.types";

    let props: FlyoutMenuToggleProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<span
    class={[
        styles.flyoutMenuToggle,
        layerClass,
        props.flags.isOpen && styles.isOpen,
    ]}
>
    <span class={styles.flyoutMenuChevron} aria-hidden="true">{FLYOUT_MENU_CHEVRON}</span>
</span>
