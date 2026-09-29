<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SidebarToggleButton/SidebarToggleButton.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { SidebarToggleButtonProps } from "./SidebarToggleButton.types";

    const OPEN_TOWARDS_RIGHT = "›";
    const OPEN_TOWARDS_LEFT = "‹";

    let { ref = $bindable(), flags, edge, isExpanded, ...others }: SidebarToggleButtonProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const isPointingRight = $derived((edge === "left") !== isExpanded);
</script>

<button
    bind:this={ref}
    {...others}
    type="button"
    class={[styles.sidebarToggle, layerClass, flags.isHovered && styles.isHovered]}
>
    <span aria-hidden="true">{isPointingRight ? OPEN_TOWARDS_RIGHT : OPEN_TOWARDS_LEFT}</span>
</button>
