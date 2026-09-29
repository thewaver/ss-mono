<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/DatePickerTrigger/DatePickerTrigger.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { DatePickerTriggerProps } from "./DatePickerTrigger.types";

    let props: DatePickerTriggerProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.datePickerTrigger,
        layerClass,
        props.flags.isHovered && styles.isHovered,
        props.flags.isOpen && styles.isOpen,
        props.flags.isDisabled && styles.isDisabled,
    ]}
    aria-hidden="true"
>
    {"▦"}
</div>
