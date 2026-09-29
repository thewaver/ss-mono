<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/WheelContent/WheelContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageWheelSpinProps } from "./WheelContent.types";

    let props: PageWheelSpinProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.wheelSpin,
        layerClass,
        props.flags.isHovered && styles.isHovered,
        props.flags.isActive && styles.isActive,
        props.flags.isDisabled && styles.isDisabled,
    ]}
    aria-hidden="true"
>
    {props.phase === "spinning" || props.phase === "settling" ? "…" : "Spin"}
</div>
