<script lang="ts">
    import {
        NAVIGATOR_DIRECTIONS,
        SLIDE_BUTTON_DEFAULTS,
        SLIDE_BUTTON_MODES,
        SLIDE_BUTTON_ORIENTATIONS,
    } from "@thewaver/ss-components-svelte";
    import type { NavigatorDirection, SlideButtonMode, SlideButtonOrientation } from "@thewaver/ss-components-svelte";
    import { SlideButtonKnobs } from "@thewaver/ss-playground/App/Knobs/SlideButtons.const";
    import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
    import { DOCS_SECTIONS, DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.const";

    import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.svelte";
    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import DirectionsDocsExample from "./Docs/Directions.svelte";
    import HeldDocsExample from "./Docs/Held.svelte";

    let mode = $state<SlideButtonMode>(SLIDE_BUTTON_DEFAULTS.mode);
    let completionRatio = $state(SLIDE_BUTTON_DEFAULTS.completionRatio);
    let holdDurationMs = $state(SLIDE_BUTTON_DEFAULTS.holdDurationMs);
    let isDisabled = $state(false);
    let hasError = $state(false);
    let orientation = $state<SlideButtonOrientation>(SLIDE_BUTTON_DEFAULTS.orientation);
    let direction = $state<NavigatorDirection>(NAVIGATOR_DIRECTIONS[0]);
</script>

<PageDocsAlert severity="alert">
    Give every SlideButton an <span class={docsStyles.docsPropName}>ariaDescription</span> that says how to confirm it without sliding, such as which key
    to hold. Holding Enter or Space is the keyboard route <a href={WCAG_URLS["2.1.1"]}>WCAG 2.1.1</a> requires, and nothing
    else tells a screen reader user that it exists or that a plain press does nothing. A button without one
    warns in the console.
</PageDocsAlert>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {mode} {completionRatio} {holdDurationMs} {isDisabled} {hasError} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"mode"}
            {...SlideButtonKnobs.MODE_TEXT}
        >
            <PageSelectField
                value={mode}
                values={SLIDE_BUTTON_MODES}
                ariaLabel={"Mode"}
                onChange={(value) => {
                    mode = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"completionRatio"}
            {...SlideButtonKnobs.COMPLETION_RATIO_TEXT}
        >
            <PageNumberField
                value={completionRatio}
                min={SlideButtonKnobs.MIN_COMPLETION_RATIO}
                max={SlideButtonKnobs.MAX_COMPLETION_RATIO}
                step={SlideButtonKnobs.COMPLETION_RATIO_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Completion ratio"}
                onInput={(value) => {
                    completionRatio = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"holdDurationMs"}
            {...SlideButtonKnobs.HOLD_DURATION_MS_TEXT}
        >
            <PageNumberField
                value={holdDurationMs}
                min={SlideButtonKnobs.MIN_HOLD_DURATION_MS}
                max={SlideButtonKnobs.MAX_HOLD_DURATION_MS}
                step={SlideButtonKnobs.HOLD_DURATION_STEP_MS}
                width={FIELD_WIDTH}
                ariaLabel={"Hold duration"}
                onInput={(value) => {
                    holdDurationMs = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"hasError"}
            {...SlideButtonKnobs.HAS_ERROR_TEXT}
        >
            <PageCheckField
                value={hasError}
                ariaLabel={"Error"}
                onChange={(value) => {
                    hasError = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isDisabled"}
            {...SlideButtonKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.orientationDirection}
/>

<PageDocsExample path={`${DOCS_ROOT}/Directions.svelte`}>
    <DirectionsDocsExample {orientation} {direction} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"orientation"}
            {...SlideButtonKnobs.ORIENTATION_TEXT}
        >
            <PageSelectField
                value={orientation}
                values={SLIDE_BUTTON_ORIENTATIONS}
                ariaLabel={"Orientation"}
                onChange={(value) => {
                    orientation = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"direction"}
            {...SlideButtonKnobs.DIRECTION_TEXT}
        >
            <PageSelectField
                value={direction}
                values={NAVIGATOR_DIRECTIONS}
                ariaLabel={"Direction"}
                onChange={(value) => {
                    direction = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.holdingThumbEnd}
/>

<PageDocsExample path={`${DOCS_ROOT}/Held.svelte`}>
    <HeldDocsExample />
</PageDocsExample>
