<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { TextFieldContentProps } from "./TextFieldContentSvelte.types";

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
