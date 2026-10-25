<script lang="ts">
    import type { SplitPaneOrientation } from "@thewaver/ss-components-svelte";
    import { SPLIT_PANE_DEFAULTS, SPLIT_PANE_ORIENTATIONS } from "@thewaver/ss-components-svelte";
    import { SplitPaneKnobs } from "@thewaver/ss-playground/App/Knobs/SplitPanes.const";
    import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
    import { DOCS_ROOT, GUTTER_FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

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
            label={"Orientation"}
            hint={"Whether the panes sit side by side or stack. Stacked, the divider lies across between them and the up and down arrows move it."}
            controls={"Sets SplitPaneProps.orientation"}
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
            label={"Gutter size (px)"}
            hint={"How wide the draggable divider between two panes is."}
            controls={"Sets SplitPaneProps.gutterSize"}
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
            label={"Disabled"}
            hint={"Turns the divider off, so the panes keep the sizes they have."}
            controls={"Sets SplitPaneProps.isDisabled"}
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
    content={"Inside a box whose text runs right to left, the first pane sits on the right, and the divider follows the pointer and the arrow keys from that side: the left arrow grows the first pane."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Bounded panes"}
    content={"Each entry in [prop]panes[/prop] can give its pane a [prop]minPx[/prop] and a [prop]maxPx[/prop]. The pane is held between them whatever its ratio says, so this sidebar stays between 120 and 220 pixels wide while the stored ratio is left as the reader set it."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Bounded.svelte`}>
    <BoundedDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Three panes"}
    content={"Any number of panes works the same way, with a divider between each pair. A divider moves its two neighbors and nothing else, so dragging at one end never changes the far side."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Triple.svelte`}>
    <TripleDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Two pictures"}
    content={"The panes are the painter's, so they need not squeeze what is in them. Here both pictures are drawn at the full width of the frame, and each pane shows only its own side, so the divider wipes from one picture to the other."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Compare.svelte`}>
    <CompareDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Minimums that do not fit"}
    content={"When the panes' minimums add up to more than the box, the panes keep them and the row overflows, as a CSS grid does: here minimums of 250 and 400 pixels sit in a box at most 600 pixels wide, which scrolls."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Cramped.svelte`}>
    <CrampedDocsExample />
</PageDocsExample>
