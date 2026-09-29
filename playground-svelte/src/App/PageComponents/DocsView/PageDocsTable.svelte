<script lang="ts">
    import type { ApiTableKind } from "virtual:component-api";

    import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
    import { toHighlightedType } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.utils";

    import type { PageDocsTableProps } from "./DocsView.types";

    const NO_DESCRIPTION = "Not written yet.";
    const ACCESSOR_FLAG = "value or accessor";
    const REQUIRED_FLAG = "required";
    const USE_COLUMN = "Use";
    const PASSING_COLUMN = "Passing";

    const TABLE_COLUMNS: Record<ApiTableKind, [name: string, type: string]> = {
        props: ["Prop", "Type"],
        values: ["Name", "Signature"],
        aliases: ["Type", "Definition"],
        fields: ["Field", "Type"],
    };

    let props: PageDocsTableProps = $props();

    const table = $derived(props.table);

    const hasPassing = $derived(table.kind === "props");
</script>

<div class={styles.docsSection}>
    {#if table.heading}
        <h3 class={styles.docsTableTitle}>{table.heading}</h3>
    {/if}

    {#if table.description}
        <p class={styles.docsDescription}>{table.description}</p>
    {/if}

    <div class={styles.docsTableScroller}>
        <table class={styles.docsTable} data-api-table={table.name}>
            <thead>
                <tr>
                    {#each TABLE_COLUMNS[table.kind] as column (column)}
                        <th class={styles.docsHeadCell}>{column}</th>
                    {/each}
                    {#if hasPassing}
                        <th class={styles.docsHeadCell}>{PASSING_COLUMN}</th>
                    {/if}
                    {#if table.isDocumented}
                        <th class={styles.docsHeadCell}>{USE_COLUMN}</th>
                    {/if}
                </tr>
            </thead>

            <tbody>
                {#each table.entries as entry (entry.name)}
                    <tr data-api-row={entry.name}>
                        <td class={styles.docsNameCell}>
                            {entry.name}{#if entry.isOptional}<span class={styles.docsOptional}>{"?"}</span>{/if}
                        </td>

                        <td class={styles.docsTypeCell}>{@html toHighlightedType(entry.type)}</td>

                        {#if hasPassing}
                            <td class={styles.docsCell}>
                                {#if entry.isAccessor}
                                    <span class={styles.docsFlag}>{ACCESSOR_FLAG}</span>
                                {:else}
                                    <span>{"value"}</span>
                                {/if}
                                {#if !entry.isOptional}
                                    <span class={styles.docsFlag}>{REQUIRED_FLAG}</span>
                                {/if}
                            </td>
                        {/if}

                        {#if table.isDocumented}
                            <td class={styles.docsCell}>
                                {#if entry.description}
                                    {entry.description}
                                {:else}
                                    <span class={styles.docsPending}>{NO_DESCRIPTION}</span>
                                {/if}
                            </td>
                        {/if}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
