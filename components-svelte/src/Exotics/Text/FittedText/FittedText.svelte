<script lang="ts">
    import { untrack } from "svelte";

    import { FITTED_TEXT_DEFAULTS, FittedTextUtils, FittedTextStyles as styles } from "@thewaver/ss-components";

    import { readStore } from "../../../Utils/storeUtils.js";
    import type { FittedTextProps } from "./FittedText.types.js";

    let props: FittedTextProps = $props();

    let root = $state<HTMLDivElement>();

    const lineHeightRatio = $derived(props.lineHeightRatio ?? FITTED_TEXT_DEFAULTS.lineHeightRatio);

    const layout = FittedTextUtils.createLayout({
        getLines: () => props.lines,
        getLineHeightRatio: () => lineHeightRatio,
    });

    const getFontSizes = readStore(layout, (state) => state.fontSizes);

    $effect(() => {
        const element = root;

        if (!element) return;

        return untrack(() => layout.observe(element));
    });

    $effect(() => {
        void props.lines.join("\n");
        void lineHeightRatio;

        untrack(() => layout.update());
    });

    $effect(() => {
        untrack(() => props.onMount?.({ update: layout.update }));
    });
</script>

<div bind:this={root} class={styles.fittedTextRoot}>
    {#each props.lines as line, index (index)}
        <span
            class={styles.fittedTextLine}
            style:font-size={`${getFontSizes()[index] ?? 0}px`}
            style:line-height={lineHeightRatio}
        >
            {line}
        </span>
    {/each}
</div>
