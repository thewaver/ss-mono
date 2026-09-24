import { For, Show, createMemo } from "solid-js";
import type { ApiGroupKind, ApiTableKind } from "virtual:component-api";
import COMPONENT_API from "virtual:component-api";

import { access } from "@thewaver/ss-components";

import type { PageApiTableProps, PageApiViewProps } from "./ApiView.types";
import { toHighlightedType } from "./ApiView.utils";

import * as styles from "./ApiView.css";

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

const PageApiTable = (props: PageApiTableProps) => {
    const getTable = () => access(props.table);

    const getHasPassing = () => getTable().kind === "props";

    return (
        <div class={styles.apiSection}>
            <Show when={getTable().heading}>
                <h3 class={styles.apiTableTitle}>{getTable().heading}</h3>
            </Show>

            <Show when={getTable().description}>
                <p class={styles.apiDescription}>{getTable().description}</p>
            </Show>

            <div class={styles.apiTableScroller}>
                <table class={styles.apiTable} data-api-table={getTable().name}>
                    <thead>
                        <tr>
                            <For each={TABLE_COLUMNS[getTable().kind]}>
                                {(column) => <th class={styles.apiHeadCell}>{column}</th>}
                            </For>
                            <Show when={getHasPassing()}>
                                <th class={styles.apiHeadCell}>{PASSING_COLUMN}</th>
                            </Show>
                            <Show when={getTable().isDocumented}>
                                <th class={styles.apiHeadCell}>{USE_COLUMN}</th>
                            </Show>
                        </tr>
                    </thead>

                    <tbody>
                        <For each={getTable().entries}>
                            {(entry) => (
                                <tr data-api-row={entry.name}>
                                    <td class={styles.apiNameCell}>
                                        {entry.name}
                                        <Show when={entry.isOptional}>
                                            <span class={styles.apiOptional}>{"?"}</span>
                                        </Show>
                                    </td>

                                    <td class={styles.apiTypeCell} innerHTML={toHighlightedType(entry.type)} />

                                    <Show when={getHasPassing()}>
                                        <td class={styles.apiCell}>
                                            <Show when={entry.isAccessor} fallback={<span>{"value"}</span>}>
                                                <span class={styles.apiFlag}>{ACCESSOR_FLAG}</span>
                                            </Show>
                                            <Show when={!entry.isOptional}>
                                                {" "}
                                                <span class={styles.apiFlag}>{REQUIRED_FLAG}</span>
                                            </Show>
                                        </td>
                                    </Show>

                                    <Show when={getTable().isDocumented}>
                                        <td class={styles.apiCell}>
                                            <Show
                                                when={entry.description}
                                                fallback={<span class={styles.apiPending}>{NO_DESCRIPTION}</span>}
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

export const PageApiView = (props: PageApiViewProps) => {
    const getGroups = createMemo(() => COMPONENT_API[access(props.name).toLowerCase()] ?? []);

    return (
        <div class={styles.apiView} data-view={"api"}>
            <Show
                when={getGroups().length}
                fallback={
                    <p class={styles.apiEmpty}>
                        {`${access(props.name)} exports nothing of its own, so there is nothing to list.`}
                    </p>
                }
            >
                <For each={getGroups()}>
                    {(group) => (
                        <section class={styles.apiGroup} data-api-group={group.kind}>
                            <h2 class={styles.apiGroupTitle}>{GROUP_TITLES[group.kind]}</h2>

                            <For each={group.tables}>{(table) => <PageApiTable table={table} />}</For>
                        </section>
                    )}
                </For>
            </Show>
        </div>
    );
};
