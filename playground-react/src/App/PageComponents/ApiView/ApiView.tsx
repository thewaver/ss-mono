import type { MouseEvent } from "react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { ApiGroup, ApiGroupKind, ApiTableKind } from "virtual:component-api";

import { TableOfContents, TableOfContentsUtils, useLatest } from "@thewaver/ss-components-react";
import type { TableOfContentsLink } from "@thewaver/ss-components-react";
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
import type { PageApiTableProps, PageApiTextProps, PageApiViewProps } from "./ApiViewReact.types";

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

const getIsPlainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

const PageApiText = (props: PageApiTextProps) =>
    props.text.map((part, index) => (
        <Fragment key={index}>
            {part.kind === "prop" ? (
                <span className={styles.docsPropName}>{part.text}</span>
            ) : part.kind === "link" ? (
                <a href={part.href}>{part.text}</a>
            ) : (
                part.text
            )}
        </Fragment>
    ));

const PageApiTable = (props: PageApiTableProps) => {
    const table = props.table;

    return (
        <div className={styles.docsSection} data-api-table={table.name}>
            {table.heading && (
                <h3 ref={props.headingRef} id={props.headingId} className={styles.docsTableTitle}>
                    {table.heading}
                </h3>
            )}

            {table.description.length > 0 && (
                <p className={styles.docsDescription}>
                    <PageApiText text={table.description} />
                </p>
            )}

            {table.includes.length > 0 && (
                <p className={styles.docsDescription} data-api-includes>
                    {DOCS_INCLUDES_LEAD}
                    {table.includes.map((include, index) => {
                        const href = toDocsIncludeHref(include, props.unit);

                        return (
                            <Fragment key={include.text}>
                                {index ? DOCS_INCLUDES_SEPARATOR : ""}
                                {href ? (
                                    <a href={href} onClick={(e) => props.onFragmentClick(e, href)}>
                                        <code>{include.text}</code>
                                    </a>
                                ) : (
                                    <code>{include.text}</code>
                                )}
                            </Fragment>
                        );
                    })}
                </p>
            )}

            {table.entries.length > 0 && (
                <div className={styles.docsTableScroller}>
                    <table className={styles.docsTable}>
                        <thead>
                            <tr>
                                {TABLE_COLUMNS[table.kind].map((column) => (
                                    <th key={column} className={styles.docsHeadCell}>
                                        {column}
                                    </th>
                                ))}
                                {table.isDocumented && <th className={styles.docsHeadCell}>{USE_COLUMN}</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {table.entries.map((entry) => (
                                <tr key={entry.name} data-api-row={entry.name}>
                                    <td className={styles.docsNameCell}>
                                        {entry.name}
                                        {entry.isOptional && <span className={styles.docsOptional}>{"?"}</span>}
                                    </td>

                                    <td
                                        className={styles.docsTypeCell}
                                        dangerouslySetInnerHTML={{ __html: toHighlightedType(entry.type) }}
                                    />

                                    {table.isDocumented && (
                                        <td className={styles.docsCell}>
                                            {entry.description.length ? (
                                                <PageApiText text={entry.description} />
                                            ) : (
                                                <span className={styles.docsPending}>{NO_DESCRIPTION}</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export const PageApiView = (props: PageApiViewProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const latestLocation = useLatest(location);
    const latestNavigate = useLatest(navigate);
    const currentEntryRef = useRef<DocsTableOfContentsEntry>(undefined);
    const hasOpenedRef = useRef(false);
    const stopHashHoldRef = useRef<() => void>(undefined);

    useEffect(() => () => stopHashHoldRef.current?.(), []);

    const toAddress = (hash: string) => `${latestLocation.current.pathname}${latestLocation.current.search}${hash}`;

    const replaceHash = (entry: DocsTableOfContentsEntry | undefined) =>
        latestNavigate.current(toAddress(entry ? `#${entry.id}` : ""), { replace: true });

    const handleFragmentClick = (e: MouseEvent, href: string) => {
        const target = href.startsWith("#") ? document.getElementById(href.slice(1)) : null;

        if (!target || !getIsPlainClick(e)) return;

        e.preventDefault();
        stopHashHoldRef.current?.();
        stopHashHoldRef.current = TableOfContentsUtils.observeNextReaderInput(() => {
            stopHashHoldRef.current = undefined;
            replaceHash(currentEntryRef.current);
        });
        navigate(toAddress(href));
        TableOfContentsUtils.goToTarget(target);
    };

    const handleCurrentChange = (entry: DocsTableOfContentsEntry | undefined) => {
        currentEntryRef.current = entry;

        if (!hasOpenedRef.current) {
            hasOpenedRef.current = true;

            return;
        }

        if (!stopHashHoldRef.current) replaceHash(entry);
    };

    const [groups, setGroups] = useState<ApiGroup[]>();
    const [headingRefs, setHeadingRefs] = useState<Record<string, HTMLElement>>({});

    useEffect(() => {
        let isCurrent = true;

        setGroups(undefined);
        loadApiGroups(props.name).then((loaded) => isCurrent && setGroups(loaded));

        return () => {
            isCurrent = false;
        };
    }, [props.name]);

    const links = useMemo(
        (): TableOfContentsLink<DocsTableOfContentsEntry>[] =>
            toDocsTableOfContents(groups ?? [], GROUP_TITLES).map((entry) => ({
                value: entry,
                target: headingRefs[entry.id],
                href: `#${entry.id}`,
                depth: entry.depth,
            })),
        [groups, headingRefs],
    );

    const setHeadingRef = (id: string) => (element: HTMLElement | null) => {
        if (!element) return;

        setHeadingRefs((prev) => (prev[id] === element ? prev : { ...prev, [id]: element }));
    };

    return (
        <div className={styles.docsLayout} data-view={"api"}>
            <div className={styles.docsView}>
                {groups === undefined ? null : groups.length ? (
                    groups.map((group) => (
                        <section key={group.kind} className={styles.docsGroup} data-api-group={group.kind}>
                            <h2
                                ref={setHeadingRef(toDocsGroupId(group.kind))}
                                id={toDocsGroupId(group.kind)}
                                className={styles.docsGroupTitle}
                            >
                                {GROUP_TITLES[group.kind]}
                            </h2>

                            {group.tables.map((table, index) => (
                                <PageApiTable
                                    key={`${table.name}-${index}`}
                                    table={table}
                                    unit={props.name}
                                    headingId={toDocsTableId(group.kind, table.name)}
                                    headingRef={setHeadingRef(toDocsTableId(group.kind, table.name))}
                                    onFragmentClick={handleFragmentClick}
                                />
                            ))}
                        </section>
                    ))
                ) : (
                    <p className={styles.docsEmpty}>
                        {`${props.name} exports nothing of its own, so there is nothing to list.`}
                    </p>
                )}
            </div>

            {links.length >= MIN_TABLE_OF_CONTENTS_LINKS && (
                <aside className={styles.docsTableOfContents}>
                    <TableOfContents
                        links={links}
                        gap={TABLE_OF_CONTENTS_GAP}
                        ariaLabel={TABLE_OF_CONTENTS_LABEL}
                        onCurrentChange={handleCurrentChange}
                        renderLink={(link, flags) => (
                            <PageTableOfContentsContent flags={flags} depth={link.value.depth}>
                                {link.value.title}
                            </PageTableOfContentsContent>
                        )}
                    />
                </aside>
            )}
        </div>
    );
};
