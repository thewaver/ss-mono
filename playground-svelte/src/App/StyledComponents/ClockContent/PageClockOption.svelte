<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ClockContent/ClockContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { ClockOptionProps } from "./ClockContent.types";

    let props: ClockOptionProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.clockOption,
        layerClass,
        props.renderProps.isSelected && styles.isSelected,
        props.renderProps.isNow && styles.isNow,
        props.renderProps.isHovered && styles.isHovered,
        props.renderProps.isDisabled && styles.isDisabled,
    ]}
    aria-hidden="true"
>
    {props.renderProps.option.label}
</div>
