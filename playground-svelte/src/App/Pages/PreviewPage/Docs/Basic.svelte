<script lang="ts">
    import { Preview } from "@thewaver/ss-components-svelte";
    import { LONG_PARAGRAPHS } from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { PreviewBasicDocsExampleProps } from "../PreviewPageSvelte.types";

    type Props = PreviewBasicDocsExampleProps;

    let props: Props = $props();
</script>

<div class={styles.panel}>
    <Preview collapsedHeight={props.collapsedHeight}>
        {#snippet renderContent()}
            <div class={styles.paragraphs}>
                {#each LONG_PARAGRAPHS as paragraph (paragraph)}
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
