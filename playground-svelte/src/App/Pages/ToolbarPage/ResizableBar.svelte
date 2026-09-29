<script lang="ts">
    import type { Snippet } from "svelte";
    import { untrack } from "svelte";

    import { ElementObserverSvelteUtils } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";

    import { getLayerClass } from "../../StyledComponents/Layer/Layer.context";

    const NO_WIDTH = 0;

    type ResizableBarProps = {
        width: number;
        onResize: (width: number) => void;
        children?: Snippet;
    };

    let props: ResizableBarProps = $props();

    let ref = $state<HTMLDivElement>();

    const layerClass = $derived.by(getLayerClass());

    const getSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => ref);

    const width = $derived(Math.round(getSize().width));

    $effect(() => {
        if (width > NO_WIDTH) untrack(() => props.onResize(width));
    });
</script>

<div bind:this={ref} class={styles.resizer} style:width={`${props.width}px`}>
    <div class={[styles.bar, layerClass]}>{@render props.children?.()}</div>
</div>
