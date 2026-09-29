<script lang="ts">
    import { untrack } from "svelte";

    import { ViewportWrapperUtils, ViewportWrapperStyles as styles } from "@thewaver/ss-components";
    import { Size2d } from "@thewaver/ss-utils";

    import { getParentViewportContext, setViewportContext } from "../../Abstracts/Viewport/Viewport.context.js";
    import type { ViewportWrapperProps } from "./ViewportWrapper.types.js";

    let props: ViewportWrapperProps = $props();

    const parentContext = getParentViewportContext();
    const isNested = parentContext !== undefined;

    let host = $state<HTMLDivElement>();
    let portal = $state<HTMLDivElement>();
    let availableSize = $state.raw(ViewportWrapperUtils.getInitialAvailableSize(isNested));

    const fit = $derived(ViewportWrapperUtils.computeFit(props.size, availableSize));
    const scale = $derived(ViewportWrapperUtils.computeScale(fit, parentContext));

    $effect(() => {
        const ref = host ?? undefined;

        return untrack(() =>
            ViewportWrapperUtils.observeAvailableSize(ref, isNested, (size) => {
                if (isNested && Size2d.isSame(availableSize, size)) return;

                availableSize = size;
            }),
        );
    });

    setViewportContext({
        getPortalRef: () => portal ?? undefined,
        getSize: () => props.size,
        getScale: () => scale,
        getScaledRect: () => ViewportWrapperUtils.computeScaledRect(fit, host ?? undefined, parentContext),
    });
</script>

<div bind:this={host} class={isNested ? styles.viewportNestedHost : styles.viewportRootHost}>
    <div
        class={styles.viewportRoot}
        style:width={`${props.size.width}px`}
        style:height={`${props.size.height}px`}
        style:transform={ViewportWrapperUtils.computeTransform(fit)}
    >
        <div class={styles.viewportContent}>
            <div bind:this={portal} class={styles.viewportPortal}></div>
            {@render props.children?.()}
        </div>
    </div>
</div>
