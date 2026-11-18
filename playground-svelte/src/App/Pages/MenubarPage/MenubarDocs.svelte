<script lang="ts">
    import { MenubarKnobs } from "@thewaver/ss-playground/App/Knobs/Menubars.const";
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import OverflowDocsExample from "./Docs/Overflow.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";

    let barWidth = $state(MenubarKnobs.STARTING_NARROW_BAR_WIDTH);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.wordsThatDoNotFit}
/>

<PageDocsExample path={`${DOCS_ROOT}/Overflow.svelte`}>
    <OverflowDocsExample {barWidth} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"barWidth"}
            {...MenubarKnobs.BAR_WIDTH_TEXT}
        >
            <PageNumberField
                value={barWidth}
                min={MenubarKnobs.MIN_BAR_WIDTH}
                max={MenubarKnobs.MAX_BAR_WIDTH}
                step={MenubarKnobs.BAR_WIDTH_STEP}
                ariaLabel={"Bar width in pixels"}
                onInput={(value) => {
                    barWidth = value;
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
