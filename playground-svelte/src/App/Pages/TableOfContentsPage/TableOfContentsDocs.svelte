<script lang="ts">
    import { TABLE_OF_CONTENTS_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { TableOfContentsKnobs } from "@thewaver/ss-playground/App/Knobs/TablesOfContents.const";
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";

    let offsetRatio = $state(TABLE_OF_CONTENTS_DEFAULTS.offsetRatio);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {offsetRatio} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"offsetRatio"}
            {...TableOfContentsKnobs.OFFSET_RATIO_TEXT}
        >
            <PageNumberField
                value={offsetRatio}
                min={TableOfContentsKnobs.MIN_OFFSET_RATIO}
                max={TableOfContentsKnobs.MAX_OFFSET_RATIO}
                step={TableOfContentsKnobs.OFFSET_RATIO_STEP}
                ariaLabel={"Offset ratio"}
                onInput={(value) => {
                    offsetRatio = value;
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
