<script lang="ts">
    import { ACCORDION_ORIENTATIONS, COLLAPSIBLE_DEFAULTS } from "@thewaver/ss-components-svelte";
    import type { AccordionOrientation } from "@thewaver/ss-components-svelte";
    import { AccordionKnobs } from "@thewaver/ss-playground/App/Knobs/Accordions.const";
    import { DOCS_SECTIONS,
        ACCORDION_POLICIES,
        DEFAULT_ACCORDION_POLICY,
        DOCS_ROOT,
        FIELD_WIDTH,
    } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
    import type { AccordionPolicy } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.types";
    import { AccordionPageUtils } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.utils";

    import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import ControlledDocsExample from "./Docs/Controlled.svelte";
    import DeferredDocsExample from "./Docs/Deferred.svelte";
    import GrowingDocsExample from "./Docs/Growing.svelte";
    import OrientationDocsExample from "./Docs/Orientation.svelte";
    import ScrolledDocsExample from "./Docs/Scrolled.svelte";

    let policy = $state<AccordionPolicy>(DEFAULT_ACCORDION_POLICY);
    let gap = $state(AccordionKnobs.STARTING_GAP);
    let transitionDurationMs = $state(COLLAPSIBLE_DEFAULTS.transitionDurationMs);
    let isScrolledIntoView = $state(true);
    let orientation = $state<AccordionOrientation>("horizontal");
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample
        isSingleExpand={AccordionPageUtils.getIsSingleExpand(policy)}
        isExpandRequired={AccordionPageUtils.getIsExpandRequired(policy)}
        {gap}
        {transitionDurationMs}
    />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"policy"}
            {...AccordionKnobs.POLICY_TEXT}
        >
            <PageSelectField
                value={policy}
                values={ACCORDION_POLICIES}
                ariaLabel={"Policy"}
                onChange={(value) => {
                    policy = value;
                }}
            />
        </PageProp>

        <PageProp itemKey={"gap"} {...AccordionKnobs.GAP_TEXT}>
            <PageNumberField
                value={gap}
                min={AccordionKnobs.MIN_GAP}
                max={AccordionKnobs.MAX_GAP}
                step={AccordionKnobs.GAP_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Gap in pixels"}
                onInput={(value) => {
                    gap = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"transitionDurationMs"}
            {...AccordionKnobs.TRANSITION_DURATION_MS_TEXT}
        >
            <PageNumberField
                value={transitionDurationMs}
                min={AccordionKnobs.MIN_TRANSITION_MS}
                max={AccordionKnobs.MAX_TRANSITION_MS}
                step={AccordionKnobs.TRANSITION_STEP_MS}
                width={FIELD_WIDTH}
                ariaLabel={"Transition duration in milliseconds"}
                onInput={(value) => {
                    transitionDurationMs = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.openingClosingOutside}
/>

<PageDocsExample path={`${DOCS_ROOT}/Controlled.svelte`}>
    <ControlledDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.panelsFollowContent}
/>

<PageDocsExample path={`${DOCS_ROOT}/Growing.svelte`}>
    <GrowingDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.builtFirstOpen}
/>

<PageDocsExample path={`${DOCS_ROOT}/Deferred.svelte`}>
    <DeferredDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.scrolledIntoView}
/>

<PageDocsExample path={`${DOCS_ROOT}/Scrolled.svelte`}>
    <ScrolledDocsExample isScrolledIntoViewOnExpand={isScrolledIntoView} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isScrolledIntoViewOnExpand"}
            {...AccordionKnobs.IS_SCROLLED_INTO_VIEW_ON_EXPAND_TEXT}
        >
            <PageCheckField
                value={isScrolledIntoView}
                ariaLabel={"Scroll into view"}
                onChange={(value) => {
                    isScrolledIntoView = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.orientation}
/>

<PageDocsExample path={`${DOCS_ROOT}/Orientation.svelte`}>
    <OrientationDocsExample {orientation} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"orientation"}
            {...AccordionKnobs.ORIENTATION_TEXT}
        >
            <PageSelectField
                value={orientation}
                values={ACCORDION_ORIENTATIONS}
                ariaLabel={"Orientation"}
                onChange={(value) => {
                    orientation = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>
