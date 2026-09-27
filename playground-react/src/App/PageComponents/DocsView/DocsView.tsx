import { useMemo } from "react";
import type { ApiGroupKind, ApiTableKind } from "virtual:component-api";
import COMPONENT_API from "virtual:component-api";

import * as styles from "@thewaver/ss-playground-core/App/PageComponents/DocsView/DocsView.css";
import { toHighlightedType } from "@thewaver/ss-playground-core/App/PageComponents/DocsView/DocsView.utils";

import type { PageDocsTableProps, PageDocsViewProps } from "./DocsView.types";

const NO_DESCRIPTION = "Not written yet.";
const ACCESSOR_FLAG = "value or accessor";
const REQUIRED_FLAG = "required";
const USE_COLUMN = "Use";
const PASSING_COLUMN = "Passing";

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

const PageDocsTable = (props: PageDocsTableProps) => {
    const table = props.table;

    const hasPassing = table.kind === "props";

    return (
        <div className={styles.docsSection}>
            {table.heading && <h3 className={styles.docsTableTitle}>{table.heading}</h3>}

            {table.description && <p className={styles.docsDescription}>{table.description}</p>}

            <div className={styles.docsTableScroller}>
                <table className={styles.docsTable} data-api-table={table.name}>
                    <thead>
                        <tr>
                            {TABLE_COLUMNS[table.kind].map((column) => (
                                <th key={column} className={styles.docsHeadCell}>
                                    {column}
                                </th>
                            ))}
                            {hasPassing && <th className={styles.docsHeadCell}>{PASSING_COLUMN}</th>}
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

                                {hasPassing && (
                                    <td className={styles.docsCell}>
                                        {entry.isAccessor ? (
                                            <span className={styles.docsFlag}>{ACCESSOR_FLAG}</span>
                                        ) : (
                                            <span>{"value"}</span>
                                        )}
                                        {!entry.isOptional && (
                                            <>
                                                {" "}
                                                <span className={styles.docsFlag}>{REQUIRED_FLAG}</span>
                                            </>
                                        )}
                                    </td>
                                )}

                                {table.isDocumented && (
                                    <td className={styles.docsCell}>
                                        {entry.description || (
                                            <span className={styles.docsPending}>{NO_DESCRIPTION}</span>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const PageDocsView = (props: PageDocsViewProps) => {
    const groups = useMemo(() => COMPONENT_API[props.name.toLowerCase()] ?? [], [props.name]);

    return (
        <div className={styles.docsView} data-view={"docs"}>
            <p className={styles.docsLead}>{props.description}</p>

            {groups.length ? (
                groups.map((group) => (
                    <section key={group.kind} className={styles.docsGroup} data-api-group={group.kind}>
                        <h2 className={styles.docsGroupTitle}>{GROUP_TITLES[group.kind]}</h2>

                        {group.tables.map((table, index) => (
                            <PageDocsTable key={`${table.name}-${index}`} table={table} />
                        ))}
                    </section>
                ))
            ) : (
                <p className={styles.docsEmpty}>
                    {`${props.name} exports nothing of its own, so there is nothing to list.`}
                </p>
            )}
        </div>
    );
};
