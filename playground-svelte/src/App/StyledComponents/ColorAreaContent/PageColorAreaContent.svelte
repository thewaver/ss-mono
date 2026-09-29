<script lang="ts">
    import { toStyle } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ColorAreaContent/ColorAreaContent.css";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { ColorAreaContentProps } from "./ColorAreaContent.types";

    const PERCENT = 100;

    let props: ColorAreaContentProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.colorAreaSquare,
        layerClass,
        props.renderProps.isDragging && styles.isDragging,
        props.renderProps.focusVisibleAxis !== undefined && styles.isFocused,
        props.renderProps.isDisabled && styles.isDisabled,
    ]}
    style={toStyle(
        assignInlineVars({
            [styles.hueVar]: `${props.renderProps.hsv.h}deg`,
            [styles.thumbXVar]: `${props.renderProps.hsv.s}%`,
            [styles.thumbYVar]: `${PERCENT - props.renderProps.hsv.v}%`,
        }),
        { height: `${props.size}px` },
    )}
>
    <div class={styles.colorAreaThumb}></div>
</div>
