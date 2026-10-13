<script lang="ts">
    import { TABLE_OF_CONTENTS_DEFAULTS } from "@thewaver/ss-components-svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    PERCENT,
    SECTIONS,
} from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import TableOfContentsExample from "./Examples/TableOfContents.svelte";

    let current = $state<string | undefined>();

    const examples: ExampleDefs[] = [
        {
            key: "tableOfContents",
            name: EXAMPLE_NAMES.tableOfContents,
            readout: () =>
                `current: ${SECTIONS.find((section) => section.id === current)?.title ?? "none"} — the last heading whose top has scrolled past a line ${TABLE_OF_CONTENTS_DEFAULTS.offsetRatio * PERCENT}% of the way down the box it scrolls in. Pressing a link scrolls only that box to its heading and focuses it, and each link's depth is indented by the painter while the list stays flat for the keyboard and a screen reader`,
            component: tableOfContentsExample,
            path: `${EXAMPLES_ROOT}/TableOfContents.svelte`,
        },
    ];
</script>

{#snippet tableOfContentsExample()}
    <TableOfContentsExample
        sections={SECTIONS}
        ariaLabel={"Outline"}
        onCurrentChange={(id) => {
            current = id;
        }}
    />
{/snippet}

<PageExamples items={examples} minColumnWidth={520} />
