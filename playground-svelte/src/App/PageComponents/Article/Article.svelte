<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/AboutPage/AboutPage.css";
    import type { AboutInline } from "@thewaver/ss-playground/App/Pages/AboutPage/AboutPage.types";
    import { AboutPageUtils } from "@thewaver/ss-playground/App/Pages/AboutPage/AboutPage.utils";

    import PageCodeBox from "../CodeBox/CodeBox.svelte";
    import PageLayer from "../Layer/Layer.svelte";
    import type { PageArticleProps } from "./Article.types";

    let props: PageArticleProps = $props();
</script>

{#snippet renderInlines(inlines: AboutInline[])}
    {#each inlines as inline, index (index)}
        {#if typeof inline === "string"}{inline}{:else}<a href={inline.href}>{inline.text}</a>{/if}
    {/each}
{/snippet}

<div class={styles.aboutPage} data-view={props.view}>
    <h1 class={styles.aboutTitle}>{props.title}</h1>

    {#each props.sections as section (section.heading)}
        <section class={styles.aboutSection}>
            <h2 class={styles.aboutHeading}>{section.heading}</h2>

            {#each section.blocks as block, index (index)}
                {#if block.kind === "paragraph"}
                    <p class={styles.aboutParagraph}>{@render renderInlines(block.text)}</p>
                {:else if block.kind === "list"}
                    <ul class={styles.aboutList}>
                        {#each block.items as item, itemIndex (itemIndex)}
                            <li>{@render renderInlines(item)}</li>
                        {/each}
                    </ul>
                {:else}
                    <PageLayer level={1}>
                        <PageCodeBox source={AboutPageUtils.toCodeHtml(block.language, block.source)} />
                    </PageLayer>
                {/if}
            {/each}
        </section>
    {/each}
</div>
