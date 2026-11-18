<script lang="ts">
    import { COLLAPSIBLE_DEFAULTS, COLLAPSIBLE_SIDES } from "@thewaver/ss-components-svelte";
    import type { CollapsibleSide } from "@thewaver/ss-components-svelte";
    import { AccordionKnobs } from "@thewaver/ss-playground/App/Knobs/Accordions.const";
    import { DOCS_SECTIONS,
        DOCS_ROOT,
        FIELD_WIDTH,
    } from "@thewaver/ss-playground/App/Pages/Accordions/CollapsiblePage/CollapsiblePage.const";

    import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import ControlledDocsExample from "./Docs/Controlled.svelte";
    import DeferredDocsExample from "./Docs/Deferred.svelte";
    import SideDocsExample from "./Docs/Side.svelte";
    import { CollapsibleKnobs } from "@thewaver/ss-playground/App/Knobs/Collapsibles.const";

    let transitionDurationMs = $state(COLLAPSIBLE_DEFAULTS.transitionDurationMs);
    let side = $state<CollapsibleSide>("right");
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {transitionDurationMs} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"transitionDurationMs"}
            {...CollapsibleKnobs.TRANSITION_DURATION_MS_TEXT}
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
    {...DOCS_SECTIONS.builtFirstOpen}
/>

<PageDocsExample path={`${DOCS_ROOT}/Deferred.svelte`}>
    <DeferredDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.openingSide}
/>

<PageDocsExample path={`${DOCS_ROOT}/Side.svelte`}>
    <SideDocsExample {side} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"side"}
            {...CollapsibleKnobs.SIDE_TEXT}
        >
            <PageSelectField
                value={side}
                values={COLLAPSIBLE_SIDES}
                ariaLabel={"Side"}
                onChange={(value) => {
                    side = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>
