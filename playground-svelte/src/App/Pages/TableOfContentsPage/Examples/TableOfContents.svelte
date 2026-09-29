<script lang="ts">
    import { TableOfContents } from "@thewaver/ss-components-svelte";
    import type { TableOfContentsLink } from "@thewaver/ss-components-svelte";
    import {
        HEADING_LEVEL,
        TOC_GAP,
    } from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.css";

    import PageTableOfContentsContent from "../../../StyledComponents/TableOfContentsContent/TableOfContentsContent.svelte";
    import type { TableOfContentsExampleProps } from "../TableOfContentsPage.types";

    const TOP_DEPTH = 0;

    type Props = TableOfContentsExampleProps;

    let props: Props = $props();

    let headingRefs = $state<(HTMLElement | undefined)[]>([]);

    const links = $derived(
        props.sections.map(
            (section, index): TableOfContentsLink<string> => ({
                value: section.id,
                target: headingRefs[index] ?? undefined,
                href: `#${section.id}`,
                depth: section.depth,
                id: `${section.id}Link`,
            }),
        ),
    );
</script>

<div class={styles.tocRoot}>
    <div class={styles.tocNav}>
        <TableOfContents {links} gap={TOC_GAP} ariaLabel={props.ariaLabel} onCurrentChange={props.onCurrentChange}>
            {#snippet renderLink(link, flags)}
                <PageTableOfContentsContent {flags} depth={link.depth ?? TOP_DEPTH}>
                    {props.sections.find((section) => section.id === link.value)?.title}
                </PageTableOfContentsContent>
            {/snippet}
        </TableOfContents>
    </div>

    <article class={styles.tocArticle}>
        {#each props.sections as section, index (section.id)}
            <section class={styles.tocSection} aria-labelledby={section.id}>
                <svelte:element
                    this={`h${HEADING_LEVEL + (section.depth ?? TOP_DEPTH)}`}
                    bind:this={headingRefs[index]}
                    id={section.id}
                    class={styles.tocHeading}
                >
                    {section.title}
                </svelte:element>

                <p>{section.text}</p>
            </section>
        {/each}
    </article>
</div>
