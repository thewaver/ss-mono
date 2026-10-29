<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ModalOverlay/ModalOverlay.css";

    import type { ModalOverlayProps } from "./ModalOverlaySvelte.types";

    let props: ModalOverlayProps = $props();

    const variants = $derived(props.isOpaque ? styles.opaqueOverlayVariants : styles.blurredOverlayVariants);
</script>

<div
    class={variants[props.visibilityTarget === 1 ? "on" : "off"]}
    style:transition={`backdrop-filter ${props.transitionDurationMs}ms, opacity ${props.transitionDurationMs}ms`}
></div>
