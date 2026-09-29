<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/StepContent/StepContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { StepContentProps } from "./StepContent.types";

    const MARKER_GLYPHS = {
        done: "✓",
        current: "",
        failed: "!",
        skipped: "–",
        ahead: "",
    } as const;

    let props: StepContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        props.orientation === "horizontal" ? styles.rowStep : styles.columnStep,
        layerClass,
        props.flags.isCurrent && styles.isCurrent,
        props.flags.isHovered && styles.isHovered,
        props.flags.isDisabled && styles.isDisabled,
    ]}
>
    <span class={styles.marker[props.state]} aria-hidden="true">
        {MARKER_GLYPHS[props.state] || props.ordinal}
    </span>{@render props.children?.()}
</div>
