<script lang="ts">
    import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-svelte";
    import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, SPOTLIGHT_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { SpotlightKnobs } from "@thewaver/ss-playground/App/Knobs/Spotlights.const";
    import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightGuidePage/SpotlightGuidePage.const";
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
    import { SpotlightGuideKnobs } from "@thewaver/ss-playground/App/Knobs/SpotlightGuides.const";

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
            {...SpotlightGuideKnobs.PADDING_TEXT}
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
            {...SpotlightGuideKnobs.TRANSITION_DURATION_MS_TEXT}
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
            {...SpotlightGuideKnobs.POPUP_PLACEMENT_X_TEXT}
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
            {...SpotlightGuideKnobs.POPUP_PLACEMENT_Y_TEXT}
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
            {...SpotlightGuideKnobs.POPUP_OFFSET_X_TEXT}
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
            {...SpotlightGuideKnobs.POPUP_OFFSET_Y_TEXT}
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
    {...DOCS_SECTIONS.tourStepReaderDoes}
/>

<PageDocsExample path={`${DOCS_ROOT}/Tour.svelte`}>
    <TourDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>
