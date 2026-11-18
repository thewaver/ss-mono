<script lang="ts">
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import ArcDocsExample from "./Docs/Arc.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import DecoratedDocsExample from "./Docs/Decorated.svelte";
    import DisabledOptionDocsExample from "./Docs/DisabledOption.svelte";
    import RatingDocsExample from "./Docs/Rating.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import SegmentedDocsExample from "./Docs/Segmented.svelte";
    import { RadioKnobs } from "@thewaver/ss-playground/App/Knobs/Radios.const";

    let hasError = $state(false);
    let isDisabled = $state(false);
    let isReachableWhenDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {hasError} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasError"}
            {...RadioKnobs.HAS_ERROR_TEXT}
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
            {...RadioKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.segmented}
/>

<PageDocsExample path={`${DOCS_ROOT}/Segmented.svelte`}>
    <SegmentedDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.rating}
/>

<PageDocsExample path={`${DOCS_ROOT}/Rating.svelte`}>
    <RatingDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.bentIntoArc}
/>

<PageDocsExample path={`${DOCS_ROOT}/Arc.svelte`}>
    <ArcDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.decoration}
/>

<PageDocsExample path={`${DOCS_ROOT}/Decorated.svelte`}>
    <DecoratedDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.disabledOption}
/>

<PageDocsExample path={`${DOCS_ROOT}/DisabledOption.svelte`}>
    <DisabledOptionDocsExample {isReachableWhenDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isReachableWhenDisabled"}
            {...RadioKnobs.IS_REACHABLE_WHEN_DISABLED_TEXT}
        >
            <PageCheckField
                value={isReachableWhenDisabled}
                ariaLabel={"Reachable when disabled"}
                onChange={(value) => {
                    isReachableWhenDisabled = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>
