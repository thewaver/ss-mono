<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/PropHintBadge/PropHintBadge.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PropHintBadgeProps } from "./PropHintBadgeSvelte.types";
    import { BADGE_GLYPH } from "@thewaver/ss-playground/App/StyledComponents/PropHintBadge/PropHintBadge.const";

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
