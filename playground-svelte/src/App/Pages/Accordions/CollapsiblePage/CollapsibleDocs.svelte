<script lang="ts">
    import { COLLAPSIBLE_DEFAULTS, COLLAPSIBLE_SIDES } from "@thewaver/ss-components-svelte";
    import type { CollapsibleSide } from "@thewaver/ss-components-svelte";
    import { AccordionKnobs } from "@thewaver/ss-playground/App/Knobs/Accordions.const";
    import {
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

    let transitionDurationMs = $state(COLLAPSIBLE_DEFAULTS.transitionDurationMs);
    let side = $state<CollapsibleSide>("right");
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {transitionDurationMs} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"transitionDurationMs"}
            label={"Transition duration (ms)"}
            hint={"How long the panel takes to open and close. At 0 it opens and closes at once."}
            controls={"Sets CollapsibleProps.transitionDurationMs"}
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

<PageDocsSection title={"Opening and closing from outside"}>
    The collapsible keeps track of whether it is open by itself. To open or close it from elsewhere on the page, hold the boolean and pass it in as expanded: both sides write it, so pressing the trigger updates yours and writing yours opens or closes the panel.
</PageDocsSection>

<PageDocsExample path={`${DOCS_ROOT}/Controlled.svelte`}>
    <ControlledDocsExample />
</PageDocsExample>

<PageDocsSection title={"Built on first open"}>
    Set isPanelBuiltOnExpand and the panel's contents are not built until it is first opened, and they are kept once they are. It trades a cheaper first render for a pause on that first open.
</PageDocsSection>

<PageDocsExample path={`${DOCS_ROOT}/Deferred.svelte`}>
    <DeferredDocsExample />
</PageDocsExample>

<PageDocsSection title={"Opening to a side"}>
    side chooses which side of the trigger the panel opens on. Top and bottom grow the panel's height, left and right its width; a sideways panel keeps its contents at their own width and uncovers them, so give them one.
</PageDocsSection>

<PageDocsExample path={`${DOCS_ROOT}/Side.svelte`}>
    <SideDocsExample {side} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"side"}
            label={"Side"}
            hint={"Which side of the trigger the panel opens on."}
            controls={"Sets CollapsibleProps.side"}
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
