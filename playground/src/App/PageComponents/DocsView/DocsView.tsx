import { For, Show, createMemo } from "solid-js";
import type { ApiGroupKind, ApiTableKind } from "virtual:component-api";
import COMPONENT_API from "virtual:component-api";

import { access } from "@thewaver/ss-components";

import type { PageDocsTableProps, PageDocsViewProps } from "./DocsView.types";
import { toHighlightedType } from "./DocsView.utils";

import * as styles from "./DocsView.css";

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
    const getTable = () => access(props.table);

    const getHasPassing = () => getTable().kind === "props";

    return (
        <div class={styles.docsSection}>
            <Show when={getTable().heading}>
                <h3 class={styles.docsTableTitle}>{getTable().heading}</h3>
            </Show>

            <Show when={getTable().description}>
                <p class={styles.docsDescription}>{getTable().description}</p>
            </Show>

            <div class={styles.docsTableScroller}>
                <table class={styles.docsTable} data-api-table={getTable().name}>
                    <thead>
                        <tr>
                            <For each={TABLE_COLUMNS[getTable().kind]}>
                                {(column) => <th class={styles.docsHeadCell}>{column}</th>}
                            </For>
                            <Show when={getHasPassing()}>
                                <th class={styles.docsHeadCell}>{PASSING_COLUMN}</th>
                            </Show>
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

                                    <Show when={getHasPassing()}>
                                        <td class={styles.docsCell}>
                                            <Show when={entry.isAccessor} fallback={<span>{"value"}</span>}>
                                                <span class={styles.docsFlag}>{ACCESSOR_FLAG}</span>
                                            </Show>
                                            <Show when={!entry.isOptional}>
                                                {" "}
                                                <span class={styles.docsFlag}>{REQUIRED_FLAG}</span>
                                            </Show>
                                        </td>
                                    </Show>

                                    <Show when={getTable().isDocumented}>
                                        <td class={styles.docsCell}>
                                            <Show
                                                when={entry.description}
                                                fallback={<span class={styles.docsPending}>{NO_DESCRIPTION}</span>}
                                            >
                                                {entry.description}
                                            </Show>
                                        </td>
                                    </Show>
                                </tr>
                            )}
                        </For>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const PageDocsView = (props: PageDocsViewProps) => {
    const getGroups = createMemo(() => COMPONENT_API[access(props.name).toLowerCase()] ?? []);

    return (
        <div class={styles.docsView} data-view={"docs"}>
            <p class={styles.docsLead}>{access(props.description)}</p>

            <Show
                when={getGroups().length}
                fallback={
                    <p class={styles.docsEmpty}>
                        {`${access(props.name)} exports nothing of its own, so there is nothing to list.`}
                    </p>
                }
            >
                <For each={getGroups()}>
                    {(group) => (
                        <section class={styles.docsGroup} data-api-group={group.kind}>
                            <h2 class={styles.docsGroupTitle}>{GROUP_TITLES[group.kind]}</h2>

                            <For each={group.tables}>{(table) => <PageDocsTable table={table} />}</For>
                        </section>
                    )}
                </For>
            </Show>
        </div>
    );
};
