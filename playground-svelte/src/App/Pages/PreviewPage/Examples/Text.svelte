<script lang="ts">
    import { Preview } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { PreviewExampleProps } from "../PreviewPage.types";

    type Props = PreviewExampleProps;

    let { expanded = $bindable(false), ...props }: Props = $props();
</script>

<div class={styles.panel}>
    <Preview
        bind:expanded
        collapsedHeight={props.collapsedHeight}
        isScrolledIntoViewOnCollapse={props.isScrolledIntoViewOnCollapse}
    >
        {#snippet renderContent()}
            <div class={styles.paragraphs}>
                {#each props.paragraphs as paragraph (paragraph)}
                    <div>{paragraph}</div>
                {/each}
            </div>
        {/snippet}

        {#snippet renderOverlay(visibilityTarget, transitionDurationMs)}
            <div
                class={styles.fade}
                style:opacity={visibilityTarget}
                style:transition={`opacity ${transitionDurationMs}ms`}
            ></div>
        {/snippet}

        {#snippet renderTrigger(flags)}
            <PageButtonContent {flags}>{flags.isExpanded ? "Show less" : "Read more"}</PageButtonContent>
        {/snippet}
    </Preview>
</div>
