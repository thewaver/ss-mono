<script lang="ts">
    import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-svelte";
    import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, SPOTLIGHT_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { SpotlightKnobs } from "@thewaver/ss-playground/App/Knobs/Spotlights.const";
    import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
    import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightGuidePage/SpotlightGuidePage.const";
    import { FIELD_WIDTH, PADDING } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";

    import PageDocsAlert from "../../../PageComponents/DocsAlert/PageDocsAlert.svelte";
    import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import TourDocsExample from "./Docs/Tour.svelte";

    let padding = $state(PADDING);
    let transitionDurationMs = $state(SPOTLIGHT_DEFAULTS.transitionDurationMs);
    let placementX = $state<AnchorHPlacement>(SPOTLIGHT_DEFAULTS.popupPlacement.x);
    let placementY = $state<AnchorVPlacement>(SPOTLIGHT_DEFAULTS.popupPlacement.y);
    let offsetX = $state(SPOTLIGHT_DEFAULTS.popupOffset.x);
    let offsetY = $state(SPOTLIGHT_DEFAULTS.popupOffset.y);

    const popupPlacement = $derived({ x: placementX, y: placementY });
    const popupOffset = $derived({ x: offsetX, y: offsetY });
</script>

<PageDocsAlert severity="alert">
    Give every step a sentence in <span class={docsStyles.docsPropName}>announcement</span>. Focus stays on the popup's
    buttons while the step changes under it, so without one a screen-reader user is told nothing about the new step
    (<a href={WCAG_URLS["4.1.3"]}>WCAG 4.1.3</a>). A guide showing a step without one warns in the console, once.
</PageDocsAlert>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {padding} {transitionDurationMs} {popupPlacement} {popupOffset} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"padding"}
            label={"Padding (px)"}
            hint={"How much room is left around the lit element, so the hole is not cut tight against it."}
            controls={"Sets SpotlightGuideProps.padding"}
        >
            <PageNumberField
                value={padding}
                min={SpotlightKnobs.MIN_PADDING}
                max={SpotlightKnobs.MAX_PADDING}
                step={SpotlightKnobs.PADDING_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Padding in pixels"}
                onInput={(value) => {
                    padding = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"transitionDurationMs"}
            label={"Transition duration (ms)"}
            hint={"How long the guide takes to fade in and out, and to move from one step to the next. At 0 it jumps."}
            controls={"Sets SpotlightGuideProps.transitionDurationMs"}
        >
            <PageNumberField
                value={transitionDurationMs}
                min={SpotlightKnobs.MIN_DURATION}
                max={SpotlightKnobs.MAX_DURATION}
                step={SpotlightKnobs.DURATION_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Transition duration in milliseconds"}
                onInput={(value) => {
                    transitionDurationMs = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"popupPlacementX"}
            label={"Popup across"}
            hint={"Where the popup sits across the lit element: lined up with an edge from inside, centered, or outside it altogether."}
            controls={"Sets SpotlightGuideProps.popupPlacement.x"}
        >
            <PageSelectField
                value={placementX}
                values={ANCHOR_H_PLACEMENTS}
                width={FIELD_WIDTH}
                ariaLabel={"Popup across"}
                onChange={(placement) => {
                    placementX = placement;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"popupPlacementY"}
            label={"Popup down"}
            hint={"Where the popup sits above or below the lit element: lined up with an edge from inside, centered, or outside it altogether."}
            controls={"Sets SpotlightGuideProps.popupPlacement.y"}
        >
            <PageSelectField
                value={placementY}
                values={ANCHOR_V_PLACEMENTS}
                width={FIELD_WIDTH}
                ariaLabel={"Popup down"}
                onChange={(placement) => {
                    placementY = placement;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"popupOffsetX"}
            label={"Offset across (px)"}
            hint={"How far the popup is held clear of the lit element sideways."}
            controls={"Sets SpotlightGuideProps.popupOffset.x"}
        >
            <PageNumberField
                value={offsetX}
                min={SpotlightKnobs.MIN_OFFSET}
                max={SpotlightKnobs.MAX_OFFSET}
                step={SpotlightKnobs.OFFSET_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Offset across in pixels"}
                onInput={(value) => {
                    offsetX = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"popupOffsetY"}
            label={"Offset down (px)"}
            hint={"How far the popup is held clear of the lit element above or below it."}
            controls={"Sets SpotlightGuideProps.popupOffset.y"}
        >
            <PageNumberField
                value={offsetY}
                min={SpotlightKnobs.MIN_OFFSET}
                max={SpotlightKnobs.MAX_OFFSET}
                step={SpotlightKnobs.OFFSET_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Offset down in pixels"}
                onInput={(value) => {
                    offsetY = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    title={"A tour with a step the reader does"}
    content={"A guide seals the whole page, so the element it lights cannot be pressed. For a step the reader is to do, open a SpotlightPrompt over the guide: the guide fades but stays open while the prompt lights the one control, and using the control brings the guide back on the next step. Escape on the prompt brings the guide back on the same step. Escape on the guide closes it, and the tour pauses where it was. The example also keeps the step in sessionStorage, so a reload offers to resume there."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Tour.svelte`}>
    <TourDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Right to left"}
    content={"The popup takes the direction of the element it lights, so inside a box whose text runs right to left, the popup's text and buttons run from the right too. The hole and the overlay are not text, and stay as they are."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>
