<script lang="ts">
    import { ViewportWrapper } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/App.css";
    import { FunctionUtils } from "@thewaver/ss-utils";
    import type { Size2d } from "@thewaver/ss-utils";

    import { FIXED_ANCHOR_RATIO } from "./App.const";
    import AppContent from "./AppContent.svelte";
    import { DEFAULT_VIEWPORT_ANCHOR } from "./PageComponents/NavSettings/NavSettings.const";
    import type { ViewportAnchor } from "./PageComponents/NavSettings/NavSettings.types";

    const SCREEN_HEIGHT = window.screen.height;

    const getWindowInnerSize = () => ({ width: window.innerWidth, height: window.innerHeight });

    let windowSize = $state.raw<Size2d>(getWindowInnerSize());
    let viewportAnchor = $state<ViewportAnchor>(DEFAULT_VIEWPORT_ANCHOR);

    const viewportSize = $derived.by(() => {
        if (viewportAnchor === "none") return windowSize;

        if (viewportAnchor !== "auto") {
            return {
                width: Math.round((viewportAnchor * FIXED_ANCHOR_RATIO.width) / FIXED_ANCHOR_RATIO.height),
                height: viewportAnchor,
            };
        }

        const ratio = windowSize.width / windowSize.height;

        return ratio >= 1
            ? { width: Math.round(SCREEN_HEIGHT * ratio), height: SCREEN_HEIGHT }
            : { width: SCREEN_HEIGHT, height: Math.round(SCREEN_HEIGHT / ratio) };
    });

    $effect(() => {
        const throttleResize = FunctionUtils.trailingThrottle(() => {
            windowSize = getWindowInnerSize();
        }, 10);

        window.addEventListener("resize", throttleResize);

        return () => {
            window.removeEventListener("resize", throttleResize);
            throttleResize.cancel();
        };
    });
</script>

<div id="app" class={styles.appRoot}>
    <ViewportWrapper size={viewportSize}>
        <AppContent bind:viewportAnchor />
    </ViewportWrapper>
</div>
