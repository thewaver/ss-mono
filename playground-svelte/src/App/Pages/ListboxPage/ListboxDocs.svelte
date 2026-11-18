<script lang="ts">
    import { LISTBOX_ORIENTATIONS } from "@thewaver/ss-components-svelte";
    import type { ListboxOrientation } from "@thewaver/ss-components-svelte";
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ListboxPage/ListboxPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import GlideDocsExample from "./Docs/Glide.svelte";
    import GroupsDocsExample from "./Docs/Groups.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import { ListboxKnobs } from "@thewaver/ss-playground/App/Knobs/Listboxes.const";

    let isDisabled = $state(false);
    let orientation = $state<ListboxOrientation>("horizontal");
    let isGliding = $state(true);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isDisabled"}
            {...ListboxKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.severalValuesGroups}
/>

<PageDocsExample path={`${DOCS_ROOT}/Groups.svelte`}>
    <GroupsDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.horizontalRightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample {orientation} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"orientation"}
            {...ListboxKnobs.ORIENTATION_TEXT}
        >
            <PageSelectField
                value={orientation}
                values={LISTBOX_ORIENTATIONS}
                ariaLabel={"Orientation"}
                onChange={(value) => {
                    orientation = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.markersThatGlide}
/>

<PageDocsExample path={`${DOCS_ROOT}/Glide.svelte`}>
    <GlideDocsExample {isGliding} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isGliding"}
            {...ListboxKnobs.IS_GLIDING_TEXT}
        >
            <PageCheckField
                value={isGliding}
                ariaLabel={"Gliding markers"}
                onChange={(value) => {
                    isGliding = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>
