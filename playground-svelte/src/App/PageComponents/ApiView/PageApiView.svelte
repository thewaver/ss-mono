<script lang="ts">
    import { onDestroy, untrack } from "svelte";
    import type { ApiGroup, ApiGroupKind } from "virtual:component-api";

    import { TableOfContents, TableOfContentsUtils } from "@thewaver/ss-components-svelte";
    import type { TableOfContentsLink } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
    import type { DocsTableOfContentsEntry } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.types";
    import {
        loadApiGroups,
        toDocsGroupId,
        toDocsTableOfContents,
        toDocsTableId,
    } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.utils";

    import { navigate, route } from "../../App.router";
    import type { RoutePath } from "../../App.types";
    import PageTableOfContentsContent from "../../StyledComponents/TableOfContentsContent/TableOfContentsContent.svelte";
    import type { PageApiViewProps } from "./ApiViewSvelte.types";
    import PageApiTable from "./PageApiTable.svelte";
    import {
        MIN_TABLE_OF_CONTENTS_LINKS,
        TABLE_OF_CONTENTS_GAP,
        TABLE_OF_CONTENTS_LABEL,
    } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.const";

    const GROUP_TITLES: Record<ApiGroupKind, string> = {
        props: "Props",
        components: "Components",
        context: "Context",
        utilities: "Utilities",
        classes: "Classes",
        types: "Types",
    };

    const getIsPlainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

    let props: PageApiViewProps = $props();

    let currentEntry: DocsTableOfContentsEntry | undefined;
    let hasOpened = false;
    let stopHashHold: (() => void) | undefined;

    onDestroy(() => stopHashHold?.());

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

    const replaceHash = (entry: DocsTableOfContentsEntry | undefined) =>
        void navigate(route.pathname as RoutePath, {
            replace: true,
            search: route.search,
            hash: entry ? `#${entry.id}` : undefined,
            scrollToTop: false,
        });

    const handleFragmentClick = (e: MouseEvent, href: string) => {
        const target = href.startsWith("#") ? document.getElementById(href.slice(1)) : null;

        if (!target || !getIsPlainClick(e)) return;

        e.preventDefault();
        stopHashHold?.();
        stopHashHold = TableOfContentsUtils.observeNextReaderInput(() => {
            stopHashHold = undefined;
            replaceHash(currentEntry);
        });
        void navigate(route.pathname as RoutePath, { search: route.search, hash: href, scrollToTop: false }).then(() =>
            TableOfContentsUtils.goToTarget(target),
        );
    };

    const handleCurrentChange = (entry: DocsTableOfContentsEntry | undefined) => {
        currentEntry = entry;

        if (!hasOpened) {
            hasOpened = true;

            return;
        }

        if (!stopHashHold) replaceHash(entry);
    };

    const attachHeading = (id: string) => (element: HTMLElement) => {
        untrack(() => {
            headingRefs[id] = element;
        });
    };
</script>

<div class={styles.docsLayout} data-view={"api"}>
    <div class={styles.docsView}>
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
                            <PageApiTable
                                {table}
                                unit={props.name}
                                headingId={toDocsTableId(group.kind, table.name)}
                                attachHeading={attachHeading(toDocsTableId(group.kind, table.name))}
                                onFragmentClick={handleFragmentClick}
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
            <TableOfContents
                {links}
                gap={TABLE_OF_CONTENTS_GAP}
                ariaLabel={TABLE_OF_CONTENTS_LABEL}
                onCurrentChange={handleCurrentChange}
            >
                {#snippet renderLink(link, flags)}
                    <PageTableOfContentsContent {flags} depth={link.value.depth}>
                        {link.value.title}
                    </PageTableOfContentsContent>
                {/snippet}
            </TableOfContents>
        </aside>
    {/if}
</div>
