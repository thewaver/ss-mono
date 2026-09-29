<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SegmentedInputContent/SegmentedInputContent.css";
    import * as fieldStyles from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { SegmentedInputCellProps } from "./SegmentedInputContent.types";

    let props: SegmentedInputCellProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.segmentedInputCell,
        layerClass,
        props.renderProps.hasCaret && props.renderProps.isFocusVisible && styles.hasCaret,
        props.renderProps.isSelected && styles.isSelected,
        props.renderProps.isHovered && fieldStyles.isHovered,
        props.renderProps.isDisabled && fieldStyles.isDisabled,
        props.renderProps.hasError && fieldStyles.hasError,
    ]}
    data-has-caret={props.renderProps.hasCaret || undefined}
    data-selected={props.renderProps.isSelected || undefined}
>
    {props.renderProps.char ?? ""}
</div>
