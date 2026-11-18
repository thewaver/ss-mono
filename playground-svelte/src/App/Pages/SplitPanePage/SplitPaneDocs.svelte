<script lang="ts">
    import type { SplitPaneOrientation } from "@thewaver/ss-components-svelte";
    import { SPLIT_PANE_DEFAULTS, SPLIT_PANE_ORIENTATIONS } from "@thewaver/ss-components-svelte";
    import { SplitPaneKnobs } from "@thewaver/ss-playground/App/Knobs/SplitPanes.const";
    import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
    import { DOCS_SECTIONS, DOCS_ROOT, GUTTER_FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

    import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.svelte";
    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import BoundedDocsExample from "./Docs/Bounded.svelte";
    import CompareDocsExample from "./Docs/Compare.svelte";
    import CrampedDocsExample from "./Docs/Cramped.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import TripleDocsExample from "./Docs/Triple.svelte";

    let orientation = $state<SplitPaneOrientation>(SPLIT_PANE_DEFAULTS.orientation);
    let gutterSize = $state(SPLIT_PANE_DEFAULTS.gutterSize);
    let isDisabled = $state(SplitPaneKnobs.STARTING_IS_DISABLED);
</script>

<PageDocsAlert severity="alert">
    Each divider can be dragged, pressed to step it towards the side pressed, so dragging is never the only way (<a
        href={WCAG_URLS["2.5.7"]}>WCAG 2.5.7</a
    >), or focused and moved with the arrow keys, with Home and End for the ends and Enter to fold the pane before it
    away and bring it back. What it cannot do is name itself: give every pane but the last a
    <span class={docsStyles.docsPropName}>gutterAriaLabel</span> saying what its divider resizes, or a screen reader
    hears a separator with no name (<a href={WCAG_URLS["4.1.2"]}>WCAG 4.1.2</a>). A missing one is warned about in the
    console.
</PageDocsAlert>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {orientation} {gutterSize} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"orientation"}
            {...SplitPaneKnobs.ORIENTATION_TEXT}
        >
            <PageSelectField
                value={orientation}
                values={SPLIT_PANE_ORIENTATIONS}
                ariaLabel={"Orientation"}
                onChange={(value) => {
                    orientation = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"gutterSize"}
            {...SplitPaneKnobs.GUTTER_SIZE_TEXT}
        >
            <PageNumberField
                value={gutterSize}
                min={SplitPaneKnobs.MIN_GUTTER}
                max={SplitPaneKnobs.MAX_GUTTER}
                step={SplitPaneKnobs.GUTTER_STEP}
                width={GUTTER_FIELD_WIDTH}
                ariaLabel={"Gutter size in pixels"}
                onInput={(value) => {
                    gutterSize = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isDisabled"}
            {...SplitPaneKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.boundedPanes}
/>

<PageDocsExample path={`${DOCS_ROOT}/Bounded.svelte`}>
    <BoundedDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.threePanes}
/>

<PageDocsExample path={`${DOCS_ROOT}/Triple.svelte`}>
    <TripleDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.twoPictures}
/>

<PageDocsExample path={`${DOCS_ROOT}/Compare.svelte`}>
    <CompareDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.minimumsThatDoNotFit}
/>

<PageDocsExample path={`${DOCS_ROOT}/Cramped.svelte`}>
    <CrampedDocsExample />
</PageDocsExample>
