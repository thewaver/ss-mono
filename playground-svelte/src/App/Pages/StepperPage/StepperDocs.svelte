<script lang="ts">
    import { STEPPER_ORIENTATIONS } from "@thewaver/ss-components-svelte";
    import type { StepperOrientation } from "@thewaver/ss-components-svelte";
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";

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
    import { StepperKnobs } from "@thewaver/ss-playground/App/Knobs/Steppers.const";

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
            {...StepperKnobs.ORIENTATION_TEXT}
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
            {...StepperKnobs.FREE_NAVIGATION_TEXT}
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
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample isFreeNavigation={isRightToLeftFree} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"rightToLeftIsFreeNavigation"}
            {...StepperKnobs.FREE_NAVIGATION_TEXT}
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
            {...StepperKnobs.FREE_NAVIGATION_TEXT}
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
    {...DOCS_SECTIONS.stepsWithOwnContent}
/>

<PageDocsExample path={`${DOCS_ROOT}/Detailed.svelte`}>
    <DetailedDocsExample isFreeNavigation={isDetailedFree} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"detailedIsFreeNavigation"}
            {...StepperKnobs.FREE_NAVIGATION_TEXT}
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
    {...DOCS_SECTIONS.noConnector}
/>

<PageDocsExample path={`${DOCS_ROOT}/Bare.svelte`}>
    <BareDocsExample isFreeNavigation={isBareFree} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"bareIsFreeNavigation"}
            {...StepperKnobs.FREE_NAVIGATION_TEXT}
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
    {...DOCS_SECTIONS.bentAlongArc}
/>

<PageDocsExample path={`${DOCS_ROOT}/Arc.svelte`}>
    <ArcDocsExample isFreeNavigation={isArcFree} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"arcIsFreeNavigation"}
            {...StepperKnobs.FREE_NAVIGATION_TEXT}
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
