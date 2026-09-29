<script lang="ts">
    import { toStyle } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ColorAreaContent/ColorAreaContent.css";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { HueSliderProps } from "./ColorAreaContent.types";

    const HUE_THUMB_SIZE = 18;
    const HUE_MAX = 360;

    let props: HueSliderProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.hueSlider, layerClass]}>
    <div class={styles.hueTrack}></div>

    <div
        class={[styles.hueThumb, props.renderProps.focusVisibleThumb === 0 && styles.isFocused]}
        style={toStyle(
            assignInlineVars({
                [styles.swatchVar]: `hsl(${props.renderProps.values[0] % HUE_MAX} 100% 50%)`,
            }),
            { left: `calc(${props.renderProps.ratios[0]} * (100% - ${HUE_THUMB_SIZE}px))` },
        )}
    ></div>
</div>
