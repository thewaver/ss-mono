<script lang="ts">
    import { TableOfContents } from "@thewaver/ss-components-svelte";
    import type { TableOfContentsLink } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import {
        HEADING_LEVEL,
        SECTIONS,
        TOC_GAP,
    } from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.css";

    import PageTableOfContentsContent from "../../../StyledComponents/TableOfContentsContent/TableOfContentsContent.svelte";
    import type { TableOfContentsBasicDocsExampleProps } from "../TableOfContentsPageSvelte.types";

    const TOP_DEPTH = 0;

    type Props = TableOfContentsBasicDocsExampleProps;

    let props: Props = $props();

    const idPrefix = $props.id();

    let headingRefs = $state<(HTMLElement | undefined)[]>([]);
    let current = $state<string | undefined>();

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

<div class={styles.tocRoot}>
    <div class={styles.tocNav}>
        <TableOfContents
            {links}
            gap={TOC_GAP}
            offsetRatio={props.offsetRatio}
            ariaLabel={"Outline"}
            onCurrentChange={(value) => {
                current = value;
            }}
        >
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

<div class={exampleStyles.exampleReadout} data-readout>
    {`Current: ${SECTIONS.find((section) => section.id === current)?.title ?? "none"}`}
</div>
