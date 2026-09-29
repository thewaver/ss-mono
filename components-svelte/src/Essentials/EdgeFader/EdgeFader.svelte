<script lang="ts">
    import { untrack } from "svelte";

    import {
        EDGE_FADER_DEFAULTS,
        type EdgeFaderMetrics,
        EdgeFaderUtils,
        EdgeFaderStyles as styles,
    } from "@thewaver/ss-components";

    import { toStyle } from "../../Utils/styleUtils.js";
    import type { EdgeFaderProps } from "./EdgeFader.types.js";

    const getIsSameMetrics = (a: EdgeFaderMetrics, b: EdgeFaderMetrics) =>
        a.gutterWidth === b.gutterWidth &&
        a.gutterHeight === b.gutterHeight &&
        a.remaining.top === b.remaining.top &&
        a.remaining.right === b.remaining.right &&
        a.remaining.bottom === b.remaining.bottom &&
        a.remaining.left === b.remaining.left;

    let props: EdgeFaderProps = $props();

    let root = $state<HTMLDivElement>();
    let metrics = $state.raw(EdgeFaderUtils.NO_METRICS);
    let hasFocusable = $state(false);

    $effect(() => {
        const ref = root;

        if (!ref) return;

        return untrack(() =>
            EdgeFaderUtils.observe(ref, {
                onMetrics: (next) => {
                    if (!getIsSameMetrics(metrics, next)) metrics = next;
                },
                onHasFocusable: (next) => {
                    hasFocusable = next;
                },
            }),
        );
    });

    const isScrollable = $derived(EdgeFaderUtils.getIsScrollable(metrics));
    const isNamedRegion = $derived(isScrollable && props.ariaLabel !== undefined);

    const maskStyle = $derived(
        EdgeFaderUtils.computeMaskStyle({
            edges: props.edges ?? EDGE_FADER_DEFAULTS.edges,
            size: props.size ?? EDGE_FADER_DEFAULTS.size,
            isScrollAware: props.isScrollAware ?? EDGE_FADER_DEFAULTS.isScrollAware,
            metrics,
        }),
    );
</script>

<div
    bind:this={root}
    class={styles.edgeFaderRoot}
    tabindex={isScrollable && !hasFocusable ? 0 : undefined}
    role={isNamedRegion ? "region" : undefined}
    aria-label={isNamedRegion ? props.ariaLabel : undefined}
    style={toStyle(maskStyle)}
>
    {@render props.children?.()}
</div>
