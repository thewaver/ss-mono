<script lang="ts">
    import type { Component } from "svelte";

    import { ElementObserverSvelteUtils, ViewportWrapper } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/Preview/Preview.css";

    import { setPreviewContext } from "./Preview.context";
    import type { PagePreviewProps } from "./Preview.types";

    let props: PagePreviewProps = $props();

    let body = $state<HTMLElement>();

    setPreviewContext(true);

    const getBodySize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => body);

    const size = $derived({
        width: styles.PREVIEW_WIDTH,
        height: Math.max(styles.PREVIEW_MIN_HEIGHT, getBodySize().height + styles.PREVIEW_PADDING * 2),
    });
</script>

<ViewportWrapper {size}>
    <div class={styles.previewContent}>
        <div bind:this={body} class={styles.previewBody}>
            {#await props.component() then module}
                {@const Page = module.default as Component}
                <Page />
            {/await}
        </div>
    </div>
</ViewportWrapper>
