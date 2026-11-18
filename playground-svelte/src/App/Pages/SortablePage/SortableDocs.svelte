<script lang="ts">
    import type { SortableOrientation } from "@thewaver/ss-components-svelte";
    import { SORTABLE_DEFAULTS, SORTABLE_ORIENTATIONS } from "@thewaver/ss-components-svelte";
    import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";

    import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.svelte";
    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import PairDocsExample from "./Docs/Pair.svelte";
    import PickyDocsExample from "./Docs/Picky.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import RingDocsExample from "./Docs/Ring.svelte";
    import { SortableKnobs } from "@thewaver/ss-playground/App/Knobs/Sortables.const";

    let orientation = $state<SortableOrientation>(SORTABLE_DEFAULTS.orientation);
    let isDisabled = $state(false);
    let isBoardLocked = $state(false);
</script>

<PageDocsAlert severity="info">
    Every list can be worked three ways, all built in: by dragging; by tapping a card to pick it up and tapping a place
    to put it down, so dragging is never the only way (<a href={WCAG_URLS["2.5.7"]}>WCAG 2.5.7</a>); and from the
    keyboard, where Enter picks up, the arrows choose a place, Tab changes list, Enter drops and Escape cancels (<a
        href={WCAG_URLS["2.1.1"]}>WCAG 2.1.1</a
    >). What a screen reader hears at each step is the words you pass in
    <span class={docsStyles.docsPropName}>announcements</span>.
</PageDocsAlert>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {orientation} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"orientation"}
            {...SortableKnobs.ORIENTATION_TEXT}
        >
            <PageSelectField
                value={orientation}
                values={SORTABLE_ORIENTATIONS}
                ariaLabel={"Orientation"}
                onChange={(value) => {
                    orientation = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isDisabled"}
            {...SortableKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.betweenTwoLists}
/>

<PageDocsExample path={`${DOCS_ROOT}/Pair.svelte`}>
    <PairDocsExample {isBoardLocked} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isBoardLocked"}
            {...SortableKnobs.IS_BOARD_LOCKED_TEXT}
        >
            <PageCheckField
                value={isBoardLocked}
                ariaLabel={"Board locked"}
                onChange={(value) => {
                    isBoardLocked = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.listRefusingSomeCards}
/>

<PageDocsExample path={`${DOCS_ROOT}/Picky.svelte`}>
    <PickyDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.reorderingRoundRing}
/>

<PageDocsExample path={`${DOCS_ROOT}/Ring.svelte`}>
    <RingDocsExample />
</PageDocsExample>
