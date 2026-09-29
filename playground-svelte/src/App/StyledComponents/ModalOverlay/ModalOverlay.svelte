<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ModalOverlay/ModalOverlay.css";

    import type { ModalOverlayProps } from "./ModalOverlay.types";

    let props: ModalOverlayProps = $props();
</script>

<div
    class={props.visibilityTarget === 1 ? styles.overlayOn : styles.overlayOff}
    style:transition={`backdrop-filter ${props.transitionDurationMs}ms`}
></div>
