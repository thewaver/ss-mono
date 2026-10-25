<script lang="ts">
    import { STEPPER_ORIENTATIONS } from "@thewaver/ss-components-svelte";
    import type { StepperOrientation } from "@thewaver/ss-components-svelte";
    import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import ArcDocsExample from "./Docs/Arc.svelte";
    import BareDocsExample from "./Docs/Bare.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import DetailedDocsExample from "./Docs/Detailed.svelte";
    import FailedDocsExample from "./Docs/Failed.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";

    let orientation = $state<StepperOrientation>("horizontal");
    let isFreeNavigation = $state(false);
    let isRightToLeftFree = $state(false);
    let isFailedFree = $state(false);
    let isDetailedFree = $state(false);
    let isBareFree = $state(false);
    let isArcFree = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {orientation} {isFreeNavigation} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"orientation"}
            label={"Orientation"}
            hint={"Whether the steps run across the page or down it."}
            controls={"Sets StepperProps.orientation"}
        >
            <PageSelectField
                value={orientation}
                values={STEPPER_ORIENTATIONS}
                ariaLabel={"Orientation"}
                onChange={(value) => {
                    orientation = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isFreeNavigation"}
            label={"Free navigation"}
            hint={"Lets any step be pressed to jump to it, rather than only the steps already behind you."}
            controls={"Sets Step.isNavigable on every step sent to StepperProps.steps"}
        >
            <PageCheckField
                value={isFreeNavigation}
                ariaLabel={"Free navigation"}
                onChange={(value) => {
                    isFreeNavigation = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    title={"Right to left"}
    content={"Inside a box whose text runs right to left, a strip running across starts from the right: the first step sits at the right-hand end and the connectors lead to the left."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample isFreeNavigation={isRightToLeftFree} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"rightToLeftIsFreeNavigation"}
            label={"Free navigation"}
            hint={"Lets any step be pressed to jump to it, rather than only the steps already behind you."}
            controls={"Sets Step.isNavigable on every step sent to StepperProps.steps"}
        >
            <PageCheckField
                value={isRightToLeftFree}
                ariaLabel={"Free navigation"}
                onChange={(value) => {
                    isRightToLeftFree = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    title={"A step that failed"}
    content={"A step's [prop]state[/prop] is yours to invent — here one step failed and one was skipped — and the stepper never looks at what a state means. No ARIA attribute can say that a step failed, so the words have to be in each step's name, which [prop]computeStepAriaLabel[/prop] writes; paint alone is not read out ([wcag id=\"1.3.1\"]WCAG 1.3.1[/wcag]). A step that cannot be pressed but has a tooltip, through [prop]computeTooltipDefs[/prop], stays reachable by the Tab key, so the reason can be read."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Failed.svelte`}>
    <FailedDocsExample isFreeNavigation={isFailedFree} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"failedIsFreeNavigation"}
            label={"Free navigation"}
            hint={"Lets any step be pressed to jump to it, rather than only the steps already behind you."}
            controls={"Sets Step.isNavigable on every step sent to StepperProps.steps"}
        >
            <PageCheckField
                value={isFailedFree}
                ariaLabel={"Free navigation"}
                onChange={(value) => {
                    isFailedFree = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    title={"Steps that carry their own content"}
    content={"Give the stepper [prop]renderBody[/prop] and each step holds a body beside its connector, so the line runs on past the content rather than stopping at it."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Detailed.svelte`}>
    <DetailedDocsExample isFreeNavigation={isDetailedFree} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"detailedIsFreeNavigation"}
            label={"Free navigation"}
            hint={"Lets any step be pressed to jump to it, rather than only the steps already behind you."}
            controls={"Sets Step.isNavigable on every step sent to StepperProps.steps"}
        >
            <PageCheckField
                value={isDetailedFree}
                ariaLabel={"Free navigation"}
                onChange={(value) => {
                    isDetailedFree = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    title={"No connector"}
    content={"The line between steps is optional: leave out [prop]renderConnector[/prop] and nothing is drawn between them, and they sit [prop]gap[/prop] pixels apart."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Bare.svelte`}>
    <BareDocsExample isFreeNavigation={isBareFree} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"bareIsFreeNavigation"}
            label={"Free navigation"}
            hint={"Lets any step be pressed to jump to it, rather than only the steps already behind you."}
            controls={"Sets Step.isNavigable on every step sent to StepperProps.steps"}
        >
            <PageCheckField
                value={isBareFree}
                ariaLabel={"Free navigation"}
                onChange={(value) => {
                    isBareFree = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    title={"Bent along an arc"}
    content={"Give the stepper [prop]computeLayout[/prop] and each step goes where the layout puts it, here along an arc from PlacementLayoutUtils. The connector is handed where the two steps it joins sit, so the run between them follows the curve rather than cutting across it. A step's body has nowhere to go on a curve, so a stepper with a layout takes no [prop]renderBody[/prop]."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Arc.svelte`}>
    <ArcDocsExample isFreeNavigation={isArcFree} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"arcIsFreeNavigation"}
            label={"Free navigation"}
            hint={"Lets any step be pressed to jump to it, rather than only the steps already behind you."}
            controls={"Sets Step.isNavigable on every step sent to StepperProps.steps"}
        >
            <PageCheckField
                value={isArcFree}
                ariaLabel={"Free navigation"}
                onChange={(value) => {
                    isArcFree = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>
