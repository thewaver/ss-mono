<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SelectClear/SelectClear.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { SelectClearProps } from "./SelectClear.types";

    let props: SelectClearProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.selectClear,
        layerClass,
        props.flags.isHovered && styles.isHovered,
        props.flags.isActive && styles.isActive,
        props.flags.isDisabled && styles.isDisabled,
    ]}
    aria-hidden="true"
>
    ×
</div>
