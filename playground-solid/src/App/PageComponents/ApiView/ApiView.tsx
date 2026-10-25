import { For, Match, Show, Switch, createMemo, createResource, createSignal, onCleanup } from "solid-js";
import type { ApiGroupKind, ApiTableKind } from "virtual:component-api";

import { TableOfContents, TableOfContentsUtils, access } from "@thewaver/ss-components-solid";
import type { TableOfContentsLink } from "@thewaver/ss-components-solid";
import {
    MIN_TABLE_OF_CONTENTS_LINKS,
    NO_DESCRIPTION,
    TABLE_OF_CONTENTS_GAP,
    TABLE_OF_CONTENTS_LABEL,
    USE_COLUMN,
} from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.const";
import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import type { DocsTableOfContentsEntry } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.types";
import {
    DOCS_INCLUDES_LEAD,
    DOCS_INCLUDES_SEPARATOR,
    loadApiGroups,
    toDocsGroupId,
    toDocsIncludeHref,
    toDocsTableId,
    toDocsTableOfContents,
    toHighlightedType,
} from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.utils";

import { PageTableOfContentsContent } from "../../StyledComponents/TableOfContentsContent/TableOfContentsContent";
import type { PageApiTableProps, PageApiTextProps, PageApiViewProps } from "./ApiViewSolid.types";

const GROUP_TITLES: Record<ApiGroupKind, string> = {
    props: "Props",
    components: "Components",
    context: "Context",
    utilities: "Utilities",
    classes: "Classes",
    types: "Types",
};

const TABLE_COLUMNS: Record<ApiTableKind, [name: string, type: string]> = {
    props: ["Prop", "Type"],
    values: ["Name", "Signature"],
    aliases: ["Type", "Definition"],
    fields: ["Field", "Type"],
};

const toAddress = (hash: string) => `${window.location.pathname}${window.location.search}${hash}`;

const getIsPlainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

const PageApiText = (props: PageApiTextProps) => (
    <For each={props.text}>
        {(part) => (
            <Switch fallback={part.text}>
                <Match when={part.kind === "prop"}>
                    <span class={styles.docsPropName}>{part.text}</span>
                </Match>
                <Match when={part.kind === "link" && part}>
                    {(getLink) => <a href={getLink().href}>{getLink().text}</a>}
                </Match>
            </Switch>
        )}
    </For>
);

const PageApiTable = (props: PageApiTableProps) => {
    const getTable = () => access(props.table);

    return (
        <div class={styles.docsSection} data-api-table={getTable().name}>
            <Show when={getTable().heading}>
                <h3 ref={props.headingRef} id={access(props.headingId)} class={styles.docsTableTitle}>
                    {getTable().heading}
                </h3>
            </Show>

            <Show when={getTable().description.length}>
                <p class={styles.docsDescription}>
                    <PageApiText text={getTable().description} />
                </p>
            </Show>

            <Show when={getTable().includes.length}>
                <p class={styles.docsDescription} data-api-includes>
                    {DOCS_INCLUDES_LEAD}
                    <For each={getTable().includes}>
                        {(include, getIndex) => (
                            <>
                                {getIndex() ? DOCS_INCLUDES_SEPARATOR : ""}
                                <Show
                                    when={toDocsIncludeHref(include, access(props.unit))}
                                    fallback={<code>{include.text}</code>}
                                >
                                    {(getHref) => (
                                        <a href={getHref()} on:click={(e) => props.onFragmentClick(e, getHref())}>
                                            <code>{include.text}</code>
                                        </a>
                                    )}
                                </Show>
                            </>
                        )}
                    </For>
                </p>
            </Show>

            <Show when={getTable().entries.length}>
                <div class={styles.docsTableScroller}>
                    <table class={styles.docsTable}>
                        <thead>
                            <tr>
                                <For each={TABLE_COLUMNS[getTable().kind]}>
                                    {(column) => <th class={styles.docsHeadCell}>{column}</th>}
                                </For>
                                <Show when={getTable().isDocumented}>
                                    <th class={styles.docsHeadCell}>{USE_COLUMN}</th>
                                </Show>
                            </tr>
                        </thead>

                        <tbody>
                            <For each={getTable().entries}>
                                {(entry) => (
                                    <tr data-api-row={entry.name}>
                                        <td class={styles.docsNameCell}>
                                            {entry.name}
                                            <Show when={entry.isOptional}>
                                                <span class={styles.docsOptional}>{"?"}</span>
                                            </Show>
                                        </td>

                                        <td class={styles.docsTypeCell} innerHTML={toHighlightedType(entry.type)} />

                                        <Show when={getTable().isDocumented}>
                                            <td class={styles.docsCell}>
                                                <Show
                                                    when={entry.description.length}
                                                    fallback={<span class={styles.docsPending}>{NO_DESCRIPTION}</span>}
                                                >
                                                    <PageApiText text={entry.description} />
                                                </Show>
                                            </td>
                                        </Show>
                                    </tr>
                                )}
                            </For>
                        </tbody>
                    </table>
                </div>
            </Show>
        </div>
    );
};

export const PageApiView = (props: PageApiViewProps) => {
    let currentEntry: DocsTableOfContentsEntry | undefined;
    let hasOpened = false;
    let stopHashHold: (() => void) | undefined;

    onCleanup(() => stopHashHold?.());

    const replaceHash = (entry: DocsTableOfContentsEntry | undefined) =>
        window.history.replaceState(window.history.state, "", toAddress(entry ? `#${entry.id}` : ""));

    const handleFragmentClick = (e: MouseEvent, href: string) => {
        const target = href.startsWith("#") ? document.getElementById(href.slice(1)) : null;

        if (!target || !getIsPlainClick(e)) return;

        e.preventDefault();
        stopHashHold?.();
        stopHashHold = TableOfContentsUtils.observeNextReaderInput(() => {
            stopHashHold = undefined;
            replaceHash(currentEntry);
        });
        window.history.pushState(window.history.state, "", toAddress(href));
        TableOfContentsUtils.goToTarget(target);
    };

    const handleCurrentChange = (entry: DocsTableOfContentsEntry | undefined) => {
        currentEntry = entry;

        if (!hasOpened) {
            hasOpened = true;

            return;
        }

        if (!stopHashHold) replaceHash(entry);
    };

    const [getGroups] = createResource(() => access(props.name), loadApiGroups);
    const [getHeadingRefs, setHeadingRefs] = createSignal<Record<string, HTMLElement>>({});

    const getLinks = createMemo((): TableOfContentsLink<DocsTableOfContentsEntry>[] =>
        toDocsTableOfContents(getGroups() ?? [], GROUP_TITLES).map((entry) => ({
            value: entry,
            target: getHeadingRefs()[entry.id],
            href: `#${entry.id}`,
            depth: entry.depth,
        })),
    );

    const setHeadingRef = (id: string) => (element: HTMLElement) =>
        setHeadingRefs((prev) => ({ ...prev, [id]: element }));

    return (
        <div class={styles.docsLayout} data-view={"api"}>
            <div class={styles.docsView}>
                <Show when={getGroups()}>
                    {(getLoadedGroups) => (
                        <Show
                            when={getLoadedGroups().length}
                            fallback={
                                <p class={styles.docsEmpty}>
                                    {`${access(props.name)} exports nothing of its own, so there is nothing to list.`}
                                </p>
                            }
                        >
                            <For each={getLoadedGroups()}>
                                {(group) => (
                                    <section class={styles.docsGroup} data-api-group={group.kind}>
                                        <h2
                                            ref={setHeadingRef(toDocsGroupId(group.kind))}
                                            id={toDocsGroupId(group.kind)}
                                            class={styles.docsGroupTitle}
                                        >
                                            {GROUP_TITLES[group.kind]}
                                        </h2>

                                        <For each={group.tables}>
                                            {(table) => (
                                                <PageApiTable
                                                    table={table}
                                                    unit={access(props.name)}
                                                    headingId={toDocsTableId(group.kind, table.name)}
                                                    headingRef={setHeadingRef(toDocsTableId(group.kind, table.name))}
                                                    onFragmentClick={handleFragmentClick}
                                                />
                                            )}
                                        </For>
                                    </section>
                                )}
                            </For>
                        </Show>
                    )}
                </Show>
            </div>

            <Show when={getLinks().length >= MIN_TABLE_OF_CONTENTS_LINKS}>
                <aside class={styles.docsTableOfContents}>
                    <TableOfContents
                        links={getLinks}
                        gap={TABLE_OF_CONTENTS_GAP}
                        ariaLabel={TABLE_OF_CONTENTS_LABEL}
                        onCurrentChange={handleCurrentChange}
                        renderLink={(getLink, getFlags) => (
                            <PageTableOfContentsContent flags={getFlags} depth={() => getLink().value.depth}>
                                {getLink().value.title}
                            </PageTableOfContentsContent>
                        )}
                    />
                </aside>
            </Show>
        </div>
    );
};
