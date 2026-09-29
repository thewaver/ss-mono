<script lang="ts">
    import { AUTOMATIC_TABS, REACHABLE_TABS } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import AllDisabledExample from "./Examples/AllDisabled.svelte";
    import ClearableExample, { CLEARABLE_TRANSITION_DURATION_MS } from "./Examples/Clearable.svelte";
    import ColumnExample from "./Examples/Column.svelte";
    import HoneycombExample from "./Examples/Honeycomb.svelte";
    import LinkComponentExample from "./Examples/LinkComponent.svelte";
    import LinksExample from "./Examples/Links.svelte";
    import RightToLeftExample from "./Examples/RightToLeft.svelte";
    import RowExample from "./Examples/Row.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/TabsPage/Examples";

    let rowValue = $state("Render");
    let columnValue = $state("Overview");
    let linkValue = $state("Docs");
    let customLinkValue = $state("Docs");
    let autoValue = $state("Render");
    let reachableValue = $state("Render");
    let rightToLeftValue = $state("Render");
    let disabledValue = $state("Draft");
    let clearableValue = $state<string | undefined>("One");
    let honeycombValue = $state("Overview");

    const examples: ExampleDefs[] = [
        {
            key: "row",
            span: 2,
            name: "A row of tabs",
            readout: () => `selected: ${rowValue}`,
            component: rowExample,
            path: `${EXAMPLES_ROOT}/Row.svelte`,
        },
        {
            key: "column",
            span: 2,
            name: "A column of tabs",
            readout: () => `selected: ${columnValue}`,
            component: columnExample,
            path: `${EXAMPLES_ROOT}/Column.svelte`,
        },
        {
            key: "automatic",
            span: 2,
            name: "Arrows that select as they move",
            readout: () =>
                `selected: ${autoValue} — an arrow both moves the focus and takes the selection with it, which suits a panel that is already loaded`,
            component: automaticExample,
            path: `${EXAMPLES_ROOT}/Row.svelte`,
        },
        {
            key: "reachable",
            span: 2,
            name: "A disabled tab the arrows still reach",
            readout: () =>
                `selected: ${reachableValue} — Metrics is disabled but stays in the arrow walk, so focus lands on it and a reader hears that it is unavailable; pressing it still selects nothing`,
            component: reachableExample,
            path: `${EXAMPLES_ROOT}/Row.svelte`,
        },
        {
            key: "rightToLeft",
            span: 2,
            name: "Tabs in a right-to-left box",
            readout: () =>
                `selected: ${rightToLeftValue} — the box around the tabs sets dir="rtl", so they run from the right and the left arrow moves on to the next tab`,
            component: rightToLeftExample,
            path: `${EXAMPLES_ROOT}/RightToLeft.svelte`,
        },
        {
            key: "honeycomb",
            span: 2,
            name: "A honeycomb of tabs",
            readout: () =>
                `selected: ${honeycombValue} — the same tab list, placed by a layout that has no angle in it at all`,
            component: honeycombExample,
            path: `${EXAMPLES_ROOT}/Honeycomb.svelte`,
        },
        {
            key: "links",
            name: "Tabs that are links",
            readout: () => `selected: ${linkValue} — every tab carries an href, so each one is an anchor`,
            component: linksExample,
            path: `${EXAMPLES_ROOT}/Links.svelte`,
        },
        {
            key: "linkComponent",
            name: "Links through a component",
            readout: () => `selected: ${customLinkValue} — the same tabs rendered by a consumer's own link component`,
            component: linkComponentExample,
            path: `${EXAMPLES_ROOT}/LinkComponent.svelte`,
        },
        {
            key: "clearable",
            name: "A selection that can be cleared",
            readout: () =>
                `selected: ${clearableValue ?? "nothing"} — the floater plays itself out over ${CLEARABLE_TRANSITION_DURATION_MS}ms when the selection goes, and plays itself back in when one returns`,
            component: clearableExample,
            path: `${EXAMPLES_ROOT}/Clearable.svelte`,
        },
        {
            key: "disabled",
            name: "Every tab disabled",
            readout: () => `selected: ${disabledValue} — nothing can move it, so no tab holds the tab stop`,
            component: allDisabledExample,
            path: `${EXAMPLES_ROOT}/AllDisabled.svelte`,
        },
    ];
</script>

{#snippet rowExample()}
    <RowExample
        selectedValue={rowValue}
        onSelectionChange={(value) => {
            rowValue = value;
        }}
    />
{/snippet}

{#snippet columnExample()}
    <ColumnExample
        selectedValue={columnValue}
        onSelectionChange={(value) => {
            columnValue = value;
        }}
    />
{/snippet}

{#snippet automaticExample()}
    <RowExample
        selectedValue={autoValue}
        tabs={AUTOMATIC_TABS}
        idPrefix={"automatic"}
        hasAutoActivation={true}
        onSelectionChange={(value) => {
            autoValue = value;
        }}
    />
{/snippet}

{#snippet reachableExample()}
    <RowExample
        selectedValue={reachableValue}
        tabs={REACHABLE_TABS}
        idPrefix={"reachable"}
        onSelectionChange={(value) => {
            reachableValue = value;
        }}
    />
{/snippet}

{#snippet rightToLeftExample()}
    <RightToLeftExample
        selectedValue={rightToLeftValue}
        onSelectionChange={(value) => {
            rightToLeftValue = value;
        }}
    />
{/snippet}

{#snippet honeycombExample()}
    <HoneycombExample
        selectedValue={honeycombValue}
        onSelectionChange={(value) => {
            honeycombValue = value;
        }}
    />
{/snippet}

{#snippet linksExample()}
    <LinksExample
        selectedValue={linkValue}
        onSelectionChange={(value) => {
            linkValue = value;
        }}
    />
{/snippet}

{#snippet linkComponentExample()}
    <LinkComponentExample
        selectedValue={customLinkValue}
        onSelectionChange={(value) => {
            customLinkValue = value;
        }}
    />
{/snippet}

{#snippet clearableExample()}
    <ClearableExample
        selectedValue={clearableValue}
        onSelectionChange={(value) => {
            clearableValue = value;
        }}
        onClear={() => {
            clearableValue = undefined;
        }}
    />
{/snippet}

{#snippet allDisabledExample()}
    <AllDisabledExample
        selectedValue={disabledValue}
        onSelectionChange={(value) => {
            disabledValue = value;
        }}
    />
{/snippet}

<PageExamples items={examples} />
