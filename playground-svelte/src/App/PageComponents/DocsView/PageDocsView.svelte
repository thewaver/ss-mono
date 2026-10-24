<script lang="ts">
    import { untrack } from "svelte";

    import { TableOfContents } from "@thewaver/ss-components-svelte";
    import type { TableOfContentsLink } from "@thewaver/ss-components-svelte";
    import { toDocsSectionId } from "@thewaver/ss-playground/App/PageComponents/DocsSection/DocsSection.utils";
    import {
        DOCS_INTRO_TITLE,
        MIN_TABLE_OF_CONTENTS_LINKS,
        TABLE_OF_CONTENTS_GAP,
        TABLE_OF_CONTENTS_LABEL,
    } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.const";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
    import type {
        DocsSectionRegistration,
        DocsTableOfContentsEntry,
    } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.types";

    import PageTableOfContentsContent from "../../StyledComponents/TableOfContentsContent/TableOfContentsContent.svelte";
    import { setDocsViewContext } from "./DocsView.context";
    import type { PageDocsViewProps } from "./DocsViewSvelte.types";

    const SECTION_DEPTH = 0;

    let props: PageDocsViewProps = $props();

    let intro = $state.raw<HTMLElement>();
    let sections = $state.raw<DocsSectionRegistration[]>([]);

    setDocsViewContext({
        register: (section) => {
            untrack(() => {
                sections = [...sections, section];
            });

            return () => {
                sections = sections.filter((candidate) => candidate !== section);
            };
        },
    });

    const links = $derived(
        [...(intro ? [{ title: DOCS_INTRO_TITLE, element: intro }] : []), ...sections].map(
            ({ title, element }): TableOfContentsLink<DocsTableOfContentsEntry> => {
                const id = toDocsSectionId(title);

                return { value: { id, title, depth: SECTION_DEPTH }, target: element, href: `#${id}`, depth: SECTION_DEPTH };
            },
        ),
    );

    const attachIntro = (element: HTMLElement) => {
        intro = element;

        return () => {
            intro = undefined;
        };
    };
</script>

<div class={styles.docsLayout} data-view={"docs"}>
    <div class={styles.docsView}>
        <p {@attach attachIntro} id={toDocsSectionId(DOCS_INTRO_TITLE)} class={styles.docsLead}>{props.description}</p>

        {@render props.children?.()}
    </div>

    {#if links.length >= MIN_TABLE_OF_CONTENTS_LINKS}
        <aside class={styles.docsTableOfContents}>
            <TableOfContents {links} gap={TABLE_OF_CONTENTS_GAP} ariaLabel={TABLE_OF_CONTENTS_LABEL}>
                {#snippet renderLink(link, flags)}
                    <PageTableOfContentsContent {flags} depth={link.value.depth}>
                        {link.value.title}
                    </PageTableOfContentsContent>
                {/snippet}
            </TableOfContents>
        </aside>
    {/if}
</div>
