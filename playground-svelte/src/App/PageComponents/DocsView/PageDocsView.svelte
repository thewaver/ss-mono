<script lang="ts">
    import type { ApiGroupKind } from "virtual:component-api";
    import COMPONENT_API from "virtual:component-api";

    import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";

    import type { PageDocsViewProps } from "./DocsView.types";
    import PageDocsTable from "./PageDocsTable.svelte";

    const GROUP_TITLES: Record<ApiGroupKind, string> = {
        props: "Props",
        components: "Components",
        context: "Context",
        utilities: "Utilities",
        classes: "Classes",
        types: "Types",
    };

    let props: PageDocsViewProps = $props();

    const groups = $derived(COMPONENT_API[props.name.toLowerCase()] ?? []);
</script>

<div class={styles.docsView} data-view={"docs"}>
    <p class={styles.docsLead}>{props.description}</p>

    {#if groups.length}
        {#each groups as group (group.kind)}
            <section class={styles.docsGroup} data-api-group={group.kind}>
                <h2 class={styles.docsGroupTitle}>{GROUP_TITLES[group.kind]}</h2>

                {#each group.tables as table, index (`${table.name}-${index}`)}
                    <PageDocsTable {table} />
                {/each}
            </section>
        {/each}
    {:else}
        <p class={styles.docsEmpty}>
            {`${props.name} exports nothing of its own, so there is nothing to list.`}
        </p>
    {/if}
</div>
