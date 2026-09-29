<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.css";

    import type { PreviewExampleProps } from "../PreviewPage.types";
    import TextExample from "./Text.svelte";

    const AFTERWARDS = [
        "The rest of the page carries on below, which is the whole of the problem.",
        "Open the preview, read to the end of it, and close it again: everything under it jumps up by the height that just disappeared, and the control you pressed goes with it.",
        "With the scroll asked for, the box comes back to where you were standing.",
    ];

    type Props = PreviewExampleProps;

    let { expanded = $bindable(false), ...props }: Props = $props();
</script>

<div class={styles.scrollBox} data-scroll-box="">
    <TextExample
        bind:expanded
        collapsedHeight={props.collapsedHeight}
        isScrolledIntoViewOnCollapse={true}
        paragraphs={props.paragraphs}
    />

    <div class={styles.afterwards}>
        {#each AFTERWARDS as paragraph (paragraph)}
            <div>{paragraph}</div>
        {/each}
    </div>
</div>
