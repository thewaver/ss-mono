<script lang="ts">
    import { TableOfContents } from "@thewaver/ss-components-svelte";
    import type { TableOfContentsLink } from "@thewaver/ss-components-svelte";
    import { HEADING_LEVEL, SECTIONS, TOC_GAP, OUTLINE_RIGHT_LEFT_BOX_LABEL } from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.css";

    import PageTableOfContentsContent from "../../../StyledComponents/TableOfContentsContent/TableOfContentsContent.svelte";

    const TOP_DEPTH = 0;

    const idPrefix = $props.id();

    let headingRefs = $state<(HTMLElement | undefined)[]>([]);

    const toHeadingId = (sectionId: string) => `${idPrefix}-${sectionId}`;

    const links = $derived(
        SECTIONS.map(
            (section, index): TableOfContentsLink<string> => ({
                value: section.id,
                target: headingRefs[index],
                href: `#${toHeadingId(section.id)}`,
                depth: section.depth,
            }),
        ),
    );
</script>

<div dir={"rtl"} class={styles.tocRoot}>
    <div class={styles.tocNav}>
        <TableOfContents {links} gap={TOC_GAP} ariaLabel={OUTLINE_RIGHT_LEFT_BOX_LABEL}>
            {#snippet renderLink(link, flags)}
                <PageTableOfContentsContent {flags} depth={link.depth ?? TOP_DEPTH}>
                    {SECTIONS.find((section) => section.id === link.value)?.title}
                </PageTableOfContentsContent>
            {/snippet}
        </TableOfContents>
    </div>

    <article class={styles.tocArticle}>
        {#each SECTIONS as section, index (section.id)}
            <section class={styles.tocSection} aria-labelledby={toHeadingId(section.id)}>
                <svelte:element
                    this={`h${HEADING_LEVEL + (section.depth ?? TOP_DEPTH)}`}
                    bind:this={headingRefs[index]}
                    id={toHeadingId(section.id)}
                    class={styles.tocHeading}
                >
                    {section.title}
                </svelte:element>

                <p class={styles.tocText}>{section.text}</p>
            </section>
        {/each}
    </article>
</div>
