<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/PropHintBadge/PropHintBadge.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PropHintBadgeProps } from "./PropHintBadge.types";

    const BADGE_GLYPH = "?";

    let props: PropHintBadgeProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.propHintBadge,
        layerClass,
        props.flags.isHovered && styles.isHovered,
        props.flags.isActive && styles.isActive,
    ]}
>
    {BADGE_GLYPH}
</div>
