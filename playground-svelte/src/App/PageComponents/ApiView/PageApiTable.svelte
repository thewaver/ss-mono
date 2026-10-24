<script lang="ts">
    import type { ApiTableKind } from "virtual:component-api";

    import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
    import {
        DOCS_INCLUDES_LEAD,
        DOCS_INCLUDES_SEPARATOR,
        toDocsIncludeHref,
        toHighlightedType,
    } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.utils";

    import type { PageApiTableProps } from "./ApiViewSvelte.types";
    import { NO_DESCRIPTION, USE_COLUMN } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.const";

    const TABLE_COLUMNS: Record<ApiTableKind, [name: string, type: string]> = {
        props: ["Prop", "Type"],
        values: ["Name", "Signature"],
        aliases: ["Type", "Definition"],
        fields: ["Field", "Type"],
    };

    let props: PageApiTableProps = $props();

    const table = $derived(props.table);
</script>

<div class={styles.docsSection} data-api-table={table.name}>
    {#if table.heading}
        <h3 {@attach props.attachHeading} id={props.headingId} class={styles.docsTableTitle}>{table.heading}</h3>
    {/if}

    {#if table.description}
        <p class={styles.docsDescription}>{table.description}</p>
    {/if}

    {#if table.includes.length}
        <p class={styles.docsDescription} data-api-includes>
            {DOCS_INCLUDES_LEAD}{#each table.includes as include, index (include.text)}{index
                    ? DOCS_INCLUDES_SEPARATOR
                    : ""}{#if toDocsIncludeHref(include, props.unit)}<a href={toDocsIncludeHref(include, props.unit)}
                        ><code>{include.text}</code></a
                    >{:else}<code>{include.text}</code>{/if}{/each}
        </p>
    {/if}

    {#if table.entries.length}
    <div class={styles.docsTableScroller}>
        <table class={styles.docsTable}>
            <thead>
                <tr>
                    {#each TABLE_COLUMNS[table.kind] as column (column)}
                        <th class={styles.docsHeadCell}>{column}</th>
                    {/each}
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
    {/if}
</div>
