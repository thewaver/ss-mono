<script lang="ts">
    import { ACCORDION_ORIENTATIONS, COLLAPSIBLE_DEFAULTS } from "@thewaver/ss-components-svelte";
    import type { AccordionOrientation } from "@thewaver/ss-components-svelte";
    import { AccordionKnobs } from "@thewaver/ss-playground/App/Knobs/Accordions.const";
    import {
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
            label={"Policy"}
            hint={"How many sections may be open: any number, one at a time, or one at a time with never none, where the only way out of an open section is into another one."}
            controls={"Sets AccordionProps.isSingleExpand and isExpandRequired"}
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

        <PageProp itemKey={"gap"} label={"Gap (px)"} hint={"The space between sections."} controls={"Sets AccordionProps.gap"}>
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
            label={"Transition duration (ms)"}
            hint={"How long a section takes to open and close. At 0 it opens and closes at once."}
            controls={"Sets AccordionProps.transitionDurationMs"}
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
    title={"Opening and closing from outside"}
    content={"The accordion keeps track of which sections are open by itself. To open or close them from elsewhere on the page, hold the list and pass it in as [prop]expanded[/prop]: both sides write it, so a header press updates your list and writing your list opens or closes sections."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Controlled.svelte`}>
    <ControlledDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Panels that follow their content"}
    content={"A panel opens to its content's own height and keeps following it. Content that appears after the panel is open makes the panel grow, with no reopening and no height to guess."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Growing.svelte`}>
    <GrowingDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Built on first open"}
    content={"Set [prop]isPanelBuiltOnExpand[/prop] and a panel's content is not built until its section is first opened, and it stays built afterwards. Use it for panels that are costly to build."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Deferred.svelte`}>
    <DeferredDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Scrolled into view"}
    content={"Set [prop]isScrolledIntoViewOnExpand[/prop] and a section is brought into view once it has finished opening, which matters when the accordion sits in a box that scrolls: opening a section below the fold brings it up."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Scrolled.svelte`}>
    <ScrolledDocsExample isScrolledIntoViewOnExpand={isScrolledIntoView} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isScrolledIntoViewOnExpand"}
            label={"Scroll into view"}
            hint={"Brings a section into view once it has finished opening."}
            controls={"Sets AccordionProps.isScrolledIntoViewOnExpand"}
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
    title={"Orientation"}
    content={"Set [prop]orientation[/prop] to horizontal and the sections sit side by side, each panel opening beside its header and growing in width; vertical, the default, stacks them. The arrow keys that walk the headers follow it: up and down for a column, left and right for a row, reversed in right-to-left text. The panel is also told which way the person moved, forward or backward, so its content can slide in from that side; the motion is yours."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Orientation.svelte`}>
    <OrientationDocsExample {orientation} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"orientation"}
            label={"Orientation"}
            hint={"Which way the sections run: stacked, each panel opening below its header, or side by side, each panel opening beside it."}
            controls={"Sets AccordionProps.orientation"}
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
