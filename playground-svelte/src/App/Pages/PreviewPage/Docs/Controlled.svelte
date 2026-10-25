<script lang="ts">
    import { Button, Preview } from "@thewaver/ss-components-svelte";
    import { COLLAPSED_HEIGHT, LONG_PARAGRAPHS } from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";

    let isExpanded = $state(false);
</script>

<div class={styles.panel}>
    <Preview bind:expanded={isExpanded} collapsedHeight={COLLAPSED_HEIGHT}>
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

<Button
    id={"toggleFromHere"}
    onClick={() => {
        isExpanded = !isExpanded;
    }}
>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Toggle from here</PageButtonContent>
    {/snippet}
</Button>
