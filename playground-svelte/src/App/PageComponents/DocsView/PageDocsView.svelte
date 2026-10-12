<script lang="ts">
    import { untrack } from "svelte";
    import type { ApiGroup, ApiGroupKind } from "virtual:component-api";

    import { TableOfContents } from "@thewaver/ss-components-svelte";
    import type { TableOfContentsLink } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
    import type { DocsTableOfContentsEntry } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.types";
    import {
        loadApiGroups,
        toDocsGroupId,
        toDocsTableOfContents,
        toDocsTableId,
    } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.utils";

    import PageTableOfContentsContent from "../../StyledComponents/TableOfContentsContent/TableOfContentsContent.svelte";
    import type { PageDocsViewProps } from "./DocsView.types";
    import PageDocsTable from "./PageDocsTable.svelte";

    const TABLE_OF_CONTENTS_LABEL = "On this page";
    const TABLE_OF_CONTENTS_GAP = 4;
    const MIN_TABLE_OF_CONTENTS_LINKS = 2;

    const GROUP_TITLES: Record<ApiGroupKind, string> = {
        props: "Props",
        components: "Components",
        context: "Context",
        utilities: "Utilities",
        classes: "Classes",
        types: "Types",
    };

    let props: PageDocsViewProps = $props();

    let groups = $state.raw<ApiGroup[]>();
    let headingRefs = $state<Record<string, HTMLElement>>({});
    let loadToken = 0;

    $effect(() => {
        const name = props.name;

        untrack(() => {
            const token = ++loadToken;

            groups = undefined;

            void loadApiGroups(name).then((loaded) => {
                if (token !== loadToken) return;

                groups = loaded;
            });
        });
    });

    const links = $derived(
        toDocsTableOfContents(groups ?? [], GROUP_TITLES).map(
            (entry): TableOfContentsLink<DocsTableOfContentsEntry> => ({
                value: entry,
                target: headingRefs[entry.id],
                href: `#${entry.id}`,
                depth: entry.depth,
            }),
        ),
    );

    const attachHeading = (id: string) => (element: HTMLElement) => {
        untrack(() => {
            headingRefs[id] = element;
        });
    };
</script>

<div class={styles.docsLayout} data-view={"docs"}>
    <div class={styles.docsView}>
        <p class={styles.docsLead}>{props.description}</p>

        {#if groups}
            {#if groups.length}
                {#each groups as group (group.kind)}
                    <section class={styles.docsGroup} data-api-group={group.kind}>
                        <h2
                            {@attach attachHeading(toDocsGroupId(group.kind))}
                            id={toDocsGroupId(group.kind)}
                            class={styles.docsGroupTitle}
                        >
                            {GROUP_TITLES[group.kind]}
                        </h2>

                        {#each group.tables as table, index (`${table.name}-${index}`)}
                            <PageDocsTable
                                {table}
                                headingId={toDocsTableId(group.kind, table.name)}
                                attachHeading={attachHeading(toDocsTableId(group.kind, table.name))}
                            />
                        {/each}
                    </section>
                {/each}
            {:else}
                <p class={styles.docsEmpty}>
                    {`${props.name} exports nothing of its own, so there is nothing to list.`}
                </p>
            {/if}
        {/if}
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
