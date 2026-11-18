<script lang="ts">
    import { PAGINATOR_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { PaginatorKnobs } from "@thewaver/ss-playground/App/Knobs/Paginators.const";
    import { DOCS_SECTIONS, COUNT_FIELD_WIDTH, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import CountDocsExample from "./Docs/Count.svelte";
    import DialDocsExample from "./Docs/Dial.svelte";
    import EndsDocsExample from "./Docs/Ends.svelte";
    import JumpDocsExample from "./Docs/Jump.svelte";
    import LinksDocsExample from "./Docs/Links.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";

    let itemCount = $state(PaginatorKnobs.STARTING_ITEM_COUNT);
    let pageSize = $state(PaginatorKnobs.STARTING_PAGE_SIZE);
    let siblingCount = $state(PAGINATOR_DEFAULTS.siblingCount);
    let boundaryCount = $state(PAGINATOR_DEFAULTS.boundaryCount);
    let isDisabled = $state(PaginatorKnobs.STARTING_IS_DISABLED);
    let hasLinkComponent = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {itemCount} {pageSize} {siblingCount} {boundaryCount} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"itemCount"}
            {...PaginatorKnobs.ITEM_COUNT_TEXT}
        >
            <PageNumberField
                value={itemCount}
                min={PaginatorKnobs.MIN_ITEM_COUNT}
                max={PaginatorKnobs.MAX_ITEM_COUNT}
                step={PaginatorKnobs.COUNT_STEP}
                width={COUNT_FIELD_WIDTH}
                ariaLabel={"Item count"}
                onInput={(value) => {
                    itemCount = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"pageSize"}
            {...PaginatorKnobs.PAGE_SIZE_TEXT}
        >
            <PageNumberField
                value={pageSize}
                min={PaginatorKnobs.MIN_PAGE_SIZE}
                max={PaginatorKnobs.MAX_PAGE_SIZE}
                step={PaginatorKnobs.COUNT_STEP}
                width={COUNT_FIELD_WIDTH}
                ariaLabel={"Page size"}
                onInput={(value) => {
                    pageSize = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"siblingCount"}
            {...PaginatorKnobs.SIBLING_COUNT_TEXT}
        >
            <PageNumberField
                value={siblingCount}
                min={PaginatorKnobs.MIN_COUNT}
                max={PaginatorKnobs.MAX_COUNT}
                step={PaginatorKnobs.COUNT_STEP}
                width={COUNT_FIELD_WIDTH}
                ariaLabel={"Sibling count"}
                onInput={(value) => {
                    siblingCount = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"boundaryCount"}
            {...PaginatorKnobs.BOUNDARY_COUNT_TEXT}
        >
            <PageNumberField
                value={boundaryCount}
                min={PaginatorKnobs.MIN_COUNT}
                max={PaginatorKnobs.MAX_COUNT}
                step={PaginatorKnobs.COUNT_STEP}
                width={COUNT_FIELD_WIDTH}
                ariaLabel={"Boundary count"}
                onInput={(value) => {
                    boundaryCount = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isDisabled"}
            {...PaginatorKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.jumpsEitherEnd}
/>

<PageDocsExample path={`${DOCS_ROOT}/Ends.svelte`}>
    <EndsDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.pagesThatAreLinks}
/>

<PageDocsExample path={`${DOCS_ROOT}/Links.svelte`}>
    <LinksDocsExample {hasLinkComponent} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasLinkComponent"}
            {...PaginatorKnobs.HAS_LINK_COMPONENT_TEXT}
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
    {...DOCS_SECTIONS.arrowsCountBetween}
/>

<PageDocsExample path={`${DOCS_ROOT}/Count.svelte`}>
    <CountDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.goPageField}
/>

<PageDocsExample path={`${DOCS_ROOT}/Jump.svelte`}>
    <JumpDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.roundHalfDial}
/>

<PageDocsExample path={`${DOCS_ROOT}/Dial.svelte`}>
    <DialDocsExample />
</PageDocsExample>
