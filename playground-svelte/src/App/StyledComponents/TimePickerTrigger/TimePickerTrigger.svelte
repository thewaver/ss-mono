<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TimePickerTrigger/TimePickerTrigger.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { TimePickerTriggerProps } from "./TimePickerTrigger.types";

    let props: TimePickerTriggerProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.timePickerTrigger,
        layerClass,
        props.flags.isHovered && styles.isHovered,
        props.flags.isOpen && styles.isOpen,
        props.flags.isDisabled && styles.isDisabled,
    ]}
    aria-hidden="true"
>
    {"◷"}
</div>
