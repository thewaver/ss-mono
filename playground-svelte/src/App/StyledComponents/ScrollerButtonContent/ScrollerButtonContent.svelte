<script lang="ts">
    import {
        SCROLLER_GLYPH_POINTS,
        SCROLLER_GLYPH_VIEW_BOX,
    } from "@thewaver/ss-playground/App/StyledComponents/ScrollerButtonContent/ScrollerButtonContent.const";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ScrollerButtonContent/ScrollerButtonContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { ScrollerButtonContentProps } from "./ScrollerButtonContentSvelte.types";

    let props: ScrollerButtonContentProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.scrollerButton,
        layerClass,
        props.flags.isHovered && styles.isHovered,
        props.flags.isActive && styles.isActive,
        props.flags.isDisabled && styles.isDisabled,
    ]}
    aria-hidden="true"
>
    <svg
        class={[styles.scrollerButtonGlyph, styles.scrollerButtonGlyphVariants[props.axis ?? "x"][props.step]]}
        viewBox={SCROLLER_GLYPH_VIEW_BOX}
    >
        <polyline points={SCROLLER_GLYPH_POINTS} />
    </svg>
</div>
