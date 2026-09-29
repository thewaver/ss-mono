<script lang="ts">
    import { TABLE_OF_CONTENTS_DEFAULTS } from "@thewaver/ss-components-svelte";
    import {
        OUTLINE_SECTIONS,
        SECTIONS,
    } from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.const";
    import type { TableOfContentsSection } from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsSection.types";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import TableOfContentsExample from "./Examples/TableOfContents.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/TableOfContentsPage/Examples";
    const PERCENT = 100;

    const titleOf = (sections: TableOfContentsSection[], id: string | undefined) =>
        sections.find((section) => section.id === id)?.title ?? "none";

    let current = $state<string | undefined>();
    let outlineCurrent = $state<string | undefined>();

    const examples: ExampleDefs[] = [
        {
            key: "tableOfContents",
            name: "Following the page",
            readout: () =>
                `current: ${titleOf(SECTIONS, current)} — the last heading whose top has scrolled past a line ${TABLE_OF_CONTENTS_DEFAULTS.offsetRatio * PERCENT}% of the way down the window, and pressing a link scrolls to its heading and focuses it`,
            component: tableOfContentsExample,
            path: `${EXAMPLES_ROOT}/TableOfContents.svelte`,
        },
        {
            key: "outline",
            name: "Sub-sections indented under their section",
            readout: () =>
                `current: ${titleOf(OUTLINE_SECTIONS, outlineCurrent)} — each link carries a depth the painter indents by, and the list stays flat for the keyboard and a screen reader`,
            component: outlineExample,
            path: `${EXAMPLES_ROOT}/TableOfContents.svelte`,
        },
    ];
</script>

{#snippet tableOfContentsExample()}
    <TableOfContentsExample
        sections={SECTIONS}
        ariaLabel={"On this page"}
        onCurrentChange={(id) => {
            current = id;
        }}
    />
{/snippet}

{#snippet outlineExample()}
    <TableOfContentsExample
        sections={OUTLINE_SECTIONS}
        ariaLabel={"Outline"}
        onCurrentChange={(id) => {
            outlineCurrent = id;
        }}
    />
{/snippet}

<PageExamples items={examples} layout={"flow"} />
