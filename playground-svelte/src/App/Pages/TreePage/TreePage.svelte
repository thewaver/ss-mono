<script lang="ts">
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import FilesExample from "./Examples/Files.svelte";
    import LazyExample from "./Examples/Lazy.svelte";
    import LeaningExample from "./Examples/Leaning.svelte";
    import LinkComponentExample from "./Examples/LinkComponent.svelte";
    import LinksExample from "./Examples/Links.svelte";
    import OutsideExample from "./Examples/Outside.svelte";
    import RadialExample from "./Examples/Radial.svelte";
    import RecordValuesExample from "./Examples/RecordValues.svelte";
    import RightToLeftExample from "./Examples/RightToLeft.svelte";
    import VirtualizedExample from "./Examples/Virtualized.svelte";
    import {
        FILES_WITH_DISABLED,
        FILES_WITH_REACHABLE,
        RANK_ROOTS,
        STRESS_BRANCH_COUNT,
        STRESS_LEAF_COUNT,
        createStressFiles,
    } from "./TreePage.const.svelte";
    import type { Asset } from "./TreePage.types";

    const EXAMPLES_ROOT = "/src/App/Pages/TreePage/Examples";

    let defaultValue = $state<string>();
    let defaultExpanded = $state.raw<string[]>(["src"]);

    let collapsedValue = $state<string>();
    let collapsedExpanded = $state.raw<string[]>([]);

    let rightToLeftValue = $state<string>();
    let rightToLeftExpanded = $state.raw<string[]>([]);

    let disabledValue = $state<string>();
    let disabledExpanded = $state.raw<string[]>(["src", "Lib"]);

    let reachableValue = $state<string>();
    let reachableExpanded = $state.raw<string[]>(["src"]);

    let outsideValue = $state<string>();
    let outsideExpanded = $state.raw<string[]>(["src", "Lib"]);

    let linkValue = $state<string>();
    let linkExpanded = $state.raw<string[]>(["Guides"]);

    let customLinkValue = $state<string>();
    let customLinkExpanded = $state.raw<string[]>(["Guides"]);

    let lazyValue = $state<string>();
    let lazyExpanded = $state.raw<string[]>([]);

    let stressValue = $state<string>();
    let stressExpanded = $state.raw<string[]>(["package-1", "package-2", "package-3"]);
    const stressFiles = createStressFiles();

    let leaningValue = $state<string>();
    let leaningExpanded = $state.raw<string[]>(["src"]);

    let radialValue = $state<string>();
    let radialExpanded = $state.raw<string[]>(RANK_ROOTS);

    let recordValue = $state.raw<Asset>();
    let recordExpanded = $state.raw<Asset[]>([]);

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            readout: () =>
                `value: ${defaultValue ?? "undefined"} | expanded: ${JSON.stringify(defaultExpanded)} — right opens a branch, left closes it or climbs to the parent`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Files.svelte`,
        },
        {
            key: "collapsed",
            name: "Everything collapsed",
            readout: () =>
                `value: ${collapsedValue ?? "undefined"} | expanded: ${JSON.stringify(collapsedExpanded)} — asterisk opens every branch at the level focus is on`,
            component: collapsedExample,
            path: `${EXAMPLES_ROOT}/Files.svelte`,
        },
        {
            key: "rightToLeft",
            name: "In a right-to-left box",
            readout: () =>
                `value: ${rightToLeftValue ?? "undefined"} | expanded: ${JSON.stringify(rightToLeftExpanded)} — the box around the tree sets dir="rtl", so left opens a branch and right closes it or climbs to the parent`,
            component: rightToLeftExample,
            path: `${EXAMPLES_ROOT}/RightToLeft.svelte`,
        },
        {
            key: "unheld",
            name: "Nobody holding the state",
            readout: () =>
                "no signals passed — the tree keeps the selection and the open branches itself; a picked node is still marked selected and is still the tree's one tab stop",
            component: unheldExample,
            path: `${EXAMPLES_ROOT}/Files.svelte`,
        },
        {
            key: "disabled",
            name: "Disabled nodes",
            readout: () =>
                `value: ${disabledValue ?? "undefined"} — arrows skip index.ts and Lib, while what is inside Lib stays reachable`,
            component: disabledExample,
            path: `${EXAMPLES_ROOT}/Files.svelte`,
        },
        {
            key: "reachable",
            name: "Disabled nodes + reachable",
            readout: () =>
                `value: ${reachableValue ?? "undefined"} — arrows stop on node_modules, hover explains why, and nothing opens it`,
            component: reachableExample,
            path: `${EXAMPLES_ROOT}/Files.svelte`,
        },
        {
            key: "outside",
            name: "Collapsed from outside",
            readout: () =>
                `expanded: ${JSON.stringify(outsideExpanded)} — press the button, then focus a row inside Lib before the delay elapses; focus must land on Lib rather than on the page body`,
            component: outsideExample,
            path: `${EXAMPLES_ROOT}/Outside.svelte`,
        },
        {
            key: "links",
            name: "Nodes that are links",
            readout: () =>
                `value: ${linkValue ?? "undefined"} — every leaf carries an href, so each one is an anchor and the branches stay plain`,
            component: linksExample,
            path: `${EXAMPLES_ROOT}/Links.svelte`,
        },
        {
            key: "linkComponent",
            name: "Links through a component",
            readout: () =>
                `value: ${customLinkValue ?? "undefined"} — the same nodes rendered by a consumer's own link component`,
            component: linkComponentExample,
            path: `${EXAMPLES_ROOT}/LinkComponent.svelte`,
        },
        {
            key: "lazy",
            name: "Branches that arrive later",
            readout: () =>
                `expanded: ${JSON.stringify(lazyExpanded)} — packages and docs say they have children before they have them`,
            component: lazyExample,
            path: `${EXAMPLES_ROOT}/Lazy.svelte`,
        },
        {
            key: "virtualized",
            name: "Virtualized",
            readout: () =>
                `${(STRESS_BRANCH_COUNT * (STRESS_LEAF_COUNT + 1)).toLocaleString("en-GB")} rows when everything is open — expanded: ${stressExpanded.length} branches, value: ${stressValue ?? "undefined"}`,
            component: virtualizedExample,
            path: `${EXAMPLES_ROOT}/Virtualized.svelte`,
        },
        {
            key: "leaning",
            name: "Leaning toward the pointer",
            readout: () =>
                `selected: ${leaningValue ?? "nothing"} — a column layout with a proximity effect: each node shifts and brightens by how near the pointer is, and the painter keeps the selected one lit, since an effect is not told which node is current`,
            component: leaningExample,
            path: `${EXAMPLES_ROOT}/Leaning.svelte`,
        },
        {
            key: "radial",
            span: 2,
            name: "A tree drawn outward",
            readout: () =>
                `value: ${radialValue ?? "undefined"} — the layout is told which node each node hangs from, so children share the slice their parent was given, and every rank sits a ring further out whoever it hangs from`,
            component: radialExample,
            path: `${EXAMPLES_ROOT}/Radial.svelte`,
        },
        {
            key: "recordValues",
            name: "Record values",
            readout: () =>
                `value: ${recordValue?.name ?? "undefined"} | expanded: ${recordExpanded.length} branch(es) — the value is the record itself, not a name`,
            component: recordValuesExample,
            path: `${EXAMPLES_ROOT}/RecordValues.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <FilesExample bind:value={defaultValue} bind:expanded={defaultExpanded} />
{/snippet}

{#snippet collapsedExample()}
    <FilesExample bind:value={collapsedValue} bind:expanded={collapsedExpanded} />
{/snippet}

{#snippet rightToLeftExample()}
    <RightToLeftExample bind:value={rightToLeftValue} bind:expanded={rightToLeftExpanded} />
{/snippet}

{#snippet unheldExample()}
    <FilesExample />
{/snippet}

{#snippet disabledExample()}
    <FilesExample bind:value={disabledValue} bind:expanded={disabledExpanded} nodes={FILES_WITH_DISABLED} />
{/snippet}

{#snippet reachableExample()}
    <FilesExample bind:value={reachableValue} bind:expanded={reachableExpanded} nodes={FILES_WITH_REACHABLE} />
{/snippet}

{#snippet outsideExample()}
    <OutsideExample bind:value={outsideValue} bind:expanded={outsideExpanded} />
{/snippet}

{#snippet linksExample()}
    <LinksExample bind:value={linkValue} bind:expanded={linkExpanded} />
{/snippet}

{#snippet linkComponentExample()}
    <LinkComponentExample bind:value={customLinkValue} bind:expanded={customLinkExpanded} />
{/snippet}

{#snippet lazyExample()}
    <LazyExample bind:value={lazyValue} bind:expanded={lazyExpanded} />
{/snippet}

{#snippet virtualizedExample()}
    <VirtualizedExample nodes={stressFiles} bind:value={stressValue} bind:expanded={stressExpanded} />
{/snippet}

{#snippet leaningExample()}
    <LeaningExample bind:value={leaningValue} bind:expanded={leaningExpanded} />
{/snippet}

{#snippet radialExample()}
    <RadialExample bind:value={radialValue} bind:expanded={radialExpanded} />
{/snippet}

{#snippet recordValuesExample()}
    <RecordValuesExample bind:value={recordValue} bind:expanded={recordExpanded} />
{/snippet}

<PageExamples items={examples} />
