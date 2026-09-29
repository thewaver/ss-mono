<script module lang="ts">
    import { Corners } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

    export { renderHighlight, renderOverlay };
</script>

{#snippet renderOverlay(visibilityTarget: 0 | 1, transitionDurationMs: number, maskStyle: string)}
    <div
        class={visibilityTarget === 1 ? styles.overlayOn : styles.overlayOff}
        style={maskStyle}
        style:transition={`background-color ${transitionDurationMs}ms, backdrop-filter ${transitionDurationMs}ms`}
    ></div>
{/snippet}

{#snippet renderHighlight(visibilityTarget: 0 | 1)}
    <Corners color={visibilityTarget === 1 ? "yellow" : "transparent"} />
{/snippet}
