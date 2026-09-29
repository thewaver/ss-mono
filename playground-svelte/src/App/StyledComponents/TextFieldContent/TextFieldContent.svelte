<script lang="ts" module>
    import type { InteractionFlags, TextFieldTextStyle } from "@thewaver/ss-components-svelte";
    import { layerVars } from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.css";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
    import { themeVars } from "@thewaver/ss-playground/App/Theme.css";

    export const computePageTextFieldTextStyle = (flags: InteractionFlags): TextFieldTextStyle => ({
        color: flags.isDisabled ? `rgb(from ${layerVars.contrast} r g b / 50%)` : layerVars.contrast,
        caretColor: themeVars.color.primary.main,
        fontSize: styles.FIELD_FONT_SIZE,
        lineHeight: `${styles.FIELD_LINE_HEIGHT}`,
    });
</script>

<script lang="ts">
    import { getLayerClass } from "../Layer/Layer.context";
    import type { TextFieldContentProps } from "./TextFieldContent.types";

    let props: TextFieldContentProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.textFieldContent,
        layerClass,
        props.isStretched && styles.isStretched,
        props.flags.isHovered && styles.isHovered,
        props.flags.isReadOnly && styles.isReadOnly,
        props.flags.isDisabled && styles.isDisabled,
        props.flags.hasError && styles.hasError,
    ]}
    style:width={props.width ? `${props.width}px` : undefined}
    style:height={props.height ? `${props.height}px` : undefined}
></div>
