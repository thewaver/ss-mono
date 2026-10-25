<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/CheckboxContent/CheckboxContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { CheckboxContentProps } from "./CheckboxContentSvelte.types";
    import {
        CHECKED_MARK,
        MIXED_MARK,
    } from "@thewaver/ss-playground/App/StyledComponents/CheckboxContent/CheckboxContent.const";

    let props: CheckboxContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.checkboxContent,
        layerClass,
        props.flags.checkedState === true && styles.isChecked,
        props.flags.checkedState === "mixed" && styles.isMixed,
        props.flags.isHovered && styles.isHovered,
        props.flags.isDisabled && styles.isDisabled,
        props.flags.hasError && styles.hasError,
    ]}
    aria-hidden="true"
>
    <div class={styles.checkboxBox}>
        <div class={styles.checkboxMark}>
            {props.flags.checkedState === "mixed" ? MIXED_MARK : CHECKED_MARK}
        </div>
    </div>

    {@render props.children?.()}
</div>
