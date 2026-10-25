<script lang="ts">
    import { SPOTLIGHT_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { SpotlightKnobs } from "@thewaver/ss-playground/App/Knobs/Spotlights.const";
    import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightHintPage/SpotlightHintPage.const";
    import { FIELD_WIDTH, PADDING } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";

    import PageDocsAlert from "../../../PageComponents/DocsAlert/PageDocsAlert.svelte";
    import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";

    let padding = $state(PADDING);
    let transitionDurationMs = $state(SPOTLIGHT_DEFAULTS.transitionDurationMs);
</script>

<PageDocsAlert severity="alert">
    A hint is only drawn: it moves no focus and says nothing, so a screen-reader user never learns it appeared. Whatever
    it points at must also be said in text the page reads out, in the control's own name or description or in a
    sentence beside it (<a href={WCAG_URLS["1.3.1"]}>WCAG 1.3.1</a>).
</PageDocsAlert>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {padding} {transitionDurationMs} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"padding"}
            label={"Padding (px)"}
            hint={"How much room is left around the lit element, so the hole is not cut tight against it."}
            controls={"Sets SpotlightHintProps.padding"}
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
            hint={"How long the hint takes to fade in and out. At 0 it appears and goes at once."}
            controls={"Sets SpotlightHintProps.transitionDurationMs"}
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
    {/snippet}
</PageDocsExample>
