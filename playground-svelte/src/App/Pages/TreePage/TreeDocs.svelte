<script lang="ts">
    import { TreeKnobs } from "@thewaver/ss-playground/App/Knobs/Trees.const";
    import type { TreeFalloff } from "@thewaver/ss-playground/App/Pages/TreePage/TreeFalloffs.types";
    import { DOCS_SECTIONS, DOCS_ROOT, STRESS_COUNT_FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import CheckboxesDocsExample from "./Docs/Checkboxes.svelte";
    import ControlledDocsExample from "./Docs/Controlled.svelte";
    import DisabledDocsExample from "./Docs/Disabled.svelte";
    import LeaningDocsExample from "./Docs/Leaning.svelte";
    import LinksDocsExample from "./Docs/Links.svelte";
    import OnDemandDocsExample from "./Docs/OnDemand.svelte";
    import RadialDocsExample from "./Docs/Radial.svelte";
    import RecordsDocsExample from "./Docs/Records.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import VirtualizedDocsExample from "./Docs/Virtualized.svelte";

    let isReachable = $state(false);
    let hasLinkComponent = $state(false);
    let count = $state(TreeKnobs.STARTING_STRESS_COUNT);
    let falloff = $state<TreeFalloff>(TreeKnobs.STARTING_FALLOFF);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.openingClosingOutside}
/>

<PageDocsExample path={`${DOCS_ROOT}/Controlled.svelte`}>
    <ControlledDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.disabledNodes}
/>

<PageDocsExample path={`${DOCS_ROOT}/Disabled.svelte`}>
    <DisabledDocsExample {isReachable} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isReachable"}
            {...TreeKnobs.IS_REACHABLE_TEXT}
        >
            <PageCheckField
                value={isReachable}
                ariaLabel={"Reachable when disabled"}
                onChange={(value) => {
                    isReachable = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.links}
/>

<PageDocsExample path={`${DOCS_ROOT}/Links.svelte`}>
    <LinksDocsExample {hasLinkComponent} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasLinkComponent"}
            {...TreeKnobs.HAS_LINK_COMPONENT_TEXT}
        >
            <PageCheckField
                value={hasLinkComponent}
                ariaLabel={"Custom link component"}
                onChange={(value) => {
                    hasLinkComponent = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.recordsValues}
/>

<PageDocsExample path={`${DOCS_ROOT}/Records.svelte`}>
    <RecordsDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.tickingSeveral}
/>

<PageDocsExample path={`${DOCS_ROOT}/Checkboxes.svelte`}>
    <CheckboxesDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.branchesThatArriveLater}
/>

<PageDocsExample path={`${DOCS_ROOT}/OnDemand.svelte`}>
    <OnDemandDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.manyNodes}
/>

<PageDocsExample path={`${DOCS_ROOT}/Virtualized.svelte`}>
    <VirtualizedDocsExample {count} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"count"}
            {...TreeKnobs.COUNT_TEXT}
        >
            <PageNumberField
                value={count}
                min={TreeKnobs.MIN_STRESS_COUNT}
                max={TreeKnobs.MAX_STRESS_COUNT}
                step={TreeKnobs.STRESS_COUNT_STEP}
                width={STRESS_COUNT_FIELD_WIDTH}
                ariaLabel={"Node count"}
                onInput={(value) => {
                    count = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.leaningTowardPointer}
/>

<PageDocsExample path={`${DOCS_ROOT}/Leaning.svelte`}>
    <LeaningDocsExample {falloff} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"falloff"}
            {...TreeKnobs.FALLOFF_TEXT}
        >
            <PageSelectField
                value={falloff}
                values={TreeKnobs.FALLOFFS}
                ariaLabel={"Falloff"}
                onChange={(value) => {
                    falloff = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.treeDrawnOutward}
/>

<PageDocsExample path={`${DOCS_ROOT}/Radial.svelte`}>
    <RadialDocsExample />
</PageDocsExample>
