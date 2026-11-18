<script lang="ts">
    import { TABLE_SELECTION_MODES } from "@thewaver/ss-components-svelte";
    import type { TableSelectionMode } from "@thewaver/ss-components-svelte";
    import { TableKnobs } from "@thewaver/ss-playground/App/Knobs/Tables.const";
    import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import { DOCS_SECTIONS, DOCS_ROOT, STRESS_COUNT_FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.const";

    import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.svelte";
    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import ConsumerSortedDocsExample from "./Docs/ConsumerSorted.svelte";
    import ExpandableDocsExample from "./Docs/Expandable.svelte";
    import PinnedDocsExample from "./Docs/Pinned.svelte";
    import ReorderableDocsExample from "./Docs/Reorderable.svelte";
    import ResizableDocsExample from "./Docs/Resizable.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import VirtualizedDocsExample from "./Docs/Virtualized.svelte";

    let selectionMode = $state<TableSelectionMode>("multiple");
    let isDisabled = $state(false);
    let count = $state(TableKnobs.STARTING_STRESS_COUNT);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {selectionMode} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"selectionMode"}
            {...TableKnobs.SELECTION_MODE_TEXT}
        >
            <PageSelectField
                value={selectionMode}
                values={TABLE_SELECTION_MODES}
                ariaLabel={"Selection"}
                onChange={(value) => {
                    selectionMode = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isDisabled"}
            {...TableKnobs.IS_DISABLED_TEXT}
        >
            <PageCheckField
                value={isDisabled}
                ariaLabel={"Disabled"}
                onChange={(value) => {
                    isDisabled = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.resizableColumns}
/>

<PageDocsExample path={`${DOCS_ROOT}/Resizable.svelte`}>
    <ResizableDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.reorderableColumns}
/>

<PageDocsAlert severity="alert">
    Put a TableHeaderReorder in the header of every column that can be moved. Not everyone can drag, so there must be a
    way to move a column with single taps (<a href={WCAG_URLS["2.5.7"]}>WCAG 2.5.7</a>), and that control is it: tap it
    to pick the column up, then tap the header where it should go. Without one the column can only be dragged, and the
    table warns in development.
</PageDocsAlert>

<PageDocsExample path={`${DOCS_ROOT}/Reorderable.svelte`}>
    <ReorderableDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.sortedPage}
/>

<PageDocsExample path={`${DOCS_ROOT}/ConsumerSorted.svelte`}>
    <ConsumerSortedDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.manyRows}
/>

<PageDocsExample path={`${DOCS_ROOT}/Virtualized.svelte`}>
    <VirtualizedDocsExample {count} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"count"}
            {...TableKnobs.COUNT_TEXT}
        >
            <PageNumberField
                value={count}
                min={TableKnobs.MIN_STRESS_COUNT}
                max={TableKnobs.MAX_STRESS_COUNT}
                step={TableKnobs.STRESS_COUNT_STEP}
                width={STRESS_COUNT_FIELD_WIDTH}
                ariaLabel={"Row count"}
                onInput={(value) => {
                    count = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.pinnedColumns}
/>

<PageDocsExample path={`${DOCS_ROOT}/Pinned.svelte`}>
    <PinnedDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.expandableRows}
/>

<PageDocsExample path={`${DOCS_ROOT}/Expandable.svelte`}>
    <ExpandableDocsExample />
</PageDocsExample>
