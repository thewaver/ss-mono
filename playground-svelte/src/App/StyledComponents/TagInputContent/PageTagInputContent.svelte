<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TagInputContent/TagInputContent.css";
    import * as fieldStyles from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { TagInputContentProps } from "./TagInputContent.types";

    let props: TagInputContentProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.tagInputContent,
        layerClass,
        props.flags.isHovered && fieldStyles.isHovered,
        props.flags.isDisabled && fieldStyles.isDisabled,
        props.flags.hasError && fieldStyles.hasError,
    ]}
></div>
