<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/PatchBoardContent/PatchBoardContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PagePatchSocketProps } from "./PatchBoardContent.types";

    let props: PagePatchSocketProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const flags = $derived(props.flags);

    const isRefused = $derived(flags.isAimed && !flags.isAllowed);
</script>

<div
    class={[
        styles.patchSocket,
        layerClass,
        flags.kind === "in" && styles.isIn,
        flags.isTaken && styles.isTaken,
        flags.isSource && styles.isSource,
        flags.isAimed && styles.isAimed,
        isRefused && styles.isRefused,
        flags.isHovered && styles.isHovered,
        flags.isFocusVisible && styles.isFocusVisible,
        flags.isDisabled && styles.isDisabled,
    ]}
></div>
