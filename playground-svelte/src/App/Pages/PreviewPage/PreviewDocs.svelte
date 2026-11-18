<script lang="ts">
    import { PreviewKnobs } from "@thewaver/ss-playground/App/Knobs/Previews.const";
    import { DOCS_SECTIONS, COLLAPSED_HEIGHT, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import ControlledDocsExample from "./Docs/Controlled.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import ScrolledDocsExample from "./Docs/Scrolled.svelte";
    import ShortDocsExample from "./Docs/Short.svelte";

    let collapsedHeight = $state(COLLAPSED_HEIGHT);
    let isScrolledIntoViewOnCollapse = $state(true);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {collapsedHeight} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"collapsedHeight"}
            {...PreviewKnobs.COLLAPSED_HEIGHT_TEXT}
        >
            <PageNumberField
                value={collapsedHeight}
                min={PreviewKnobs.MIN_COLLAPSED_HEIGHT}
                max={PreviewKnobs.MAX_COLLAPSED_HEIGHT}
                step={PreviewKnobs.COLLAPSED_HEIGHT_STEP}
                ariaLabel={"Collapsed height in pixels"}
                onInput={(value) => {
                    collapsedHeight = value;
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
    {...DOCS_SECTIONS.whenEverythingFits}
/>

<PageDocsExample path={`${DOCS_ROOT}/Short.svelte`}>
    <ShortDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.openingClosingOutside}
/>

<PageDocsExample path={`${DOCS_ROOT}/Controlled.svelte`}>
    <ControlledDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.insideBoxThatScrolls}
/>

<PageDocsExample path={`${DOCS_ROOT}/Scrolled.svelte`}>
    <ScrolledDocsExample {isScrolledIntoViewOnCollapse} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isScrolledIntoViewOnCollapse"}
            {...PreviewKnobs.IS_SCROLLED_INTO_VIEW_ON_COLLAPSE_TEXT}
        >
            <PageCheckField
                value={isScrolledIntoViewOnCollapse}
                ariaLabel={"Scroll into view on collapse"}
                onChange={(value) => {
                    isScrolledIntoViewOnCollapse = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>
