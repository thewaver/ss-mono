<script lang="ts">
    import { ElementObserverSvelteUtils } from "@thewaver/ss-components-svelte";
    import { NO_WIDTH } from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";

    import { getLayerClass } from "../../../StyledComponents/Layer/Layer.context";
    import type { ResizableBarProps } from "../ToolbarPageSvelte.types";

    let props: ResizableBarProps = $props();

    let ref = $state<HTMLDivElement>();

    const layerClass = $derived.by(getLayerClass());

    const getSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(
        () => ref,
        () => props.width === undefined,
    );

    $effect(() => {
        const width = props.width;
        const measured = Math.round(getSize().width);

        if (!ref || width === undefined || measured <= NO_WIDTH) return;

        if (ref.style.width === `${width}px`) return;

        props.onResize?.(measured);
    });
</script>

<div
    bind:this={ref}
    class={props.width === undefined ? styles.docsResizer : styles.resizer}
    style:width={props.width === undefined ? undefined : `${props.width}px`}
>
    <div class={[styles.bar, layerClass]}>{@render props.children?.()}</div>
</div>
