<script lang="ts">
    import type { SortableOrientation } from "@thewaver/ss-components-svelte";
    import { SORTABLE_DEFAULTS, SORTABLE_ORIENTATIONS } from "@thewaver/ss-components-svelte";
    import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
    import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";

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
            label={"Orientation"}
            hint={"Whether the cards are stacked or sit side by side. While one is carried, the up and down arrows choose its place in a stack, and the left and right arrows in a row."}
            controls={"Sets SortableProps.orientation"}
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
            label={"Disabled"}
            hint={"Turns the list off: nothing in it can be picked up or moved, by pointer or by key."}
            controls={"Sets SortableProps.isDisabled"}
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
    title={"Right to left"}
    content={"Inside a box whose text runs right to left, a row of cards runs from the right, and while a card is carried the left arrow moves it on to a later place."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Between two lists"}
    content={"Lists that share a [prop]groupId[/prop] trade cards: drag one across, tap it and then tap a place in the other list, or press Tab while carrying it from the keyboard. Set [prop]isLocked[/prop] on a list and it can still be reordered, but it takes nothing from outside."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Pair.svelte`}>
    <PairDocsExample {isBoardLocked} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isBoardLocked"}
            label={"Board locked"}
            hint={"Whether the board refuses every card from the hand, while its own cards can still be reordered."}
            controls={"Sets SortableProps.isLocked on the board"}
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
    title={"A list that refuses some cards"}
    content={"Give a list [prop]computeCanAccept[/prop] and it decides card by card what it will take: this board takes nothing costing more than 3. A refused card is refused on every route, not only when it is dropped."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Picky.svelte`}>
    <PickyDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Reordering round a ring"}
    content={"Hand [prop]computeLayout[/prop] a layout and the cards are placed by it rather than laid in a line, here round a ring. A carried card lands on the nearest place instead of being compared along one axis, since a ring has none."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Ring.svelte`}>
    <RingDocsExample />
</PageDocsExample>
