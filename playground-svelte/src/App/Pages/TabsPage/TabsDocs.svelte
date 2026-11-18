<script lang="ts">
    import type { TabsOrientation } from "@thewaver/ss-components-svelte";
    import { TABS_DEFAULTS, TABS_ORIENTATIONS } from "@thewaver/ss-components-svelte";
    import { DOCS_SECTIONS, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import AutomaticDocsExample from "./Docs/Automatic.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import ClearableDocsExample from "./Docs/Clearable.svelte";
    import DisabledTabDocsExample from "./Docs/DisabledTab.svelte";
    import HoneycombDocsExample from "./Docs/Honeycomb.svelte";
    import HoverPillDocsExample from "./Docs/HoverPill.svelte";
    import LinksDocsExample from "./Docs/Links.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import { TabKnobs } from "@thewaver/ss-playground/App/Knobs/Tabs.const";

    let orientation = $state<TabsOrientation>(TABS_DEFAULTS.orientation);
    let isDisabled = $state(false);
    let hasAutoActivation = $state(true);
    let isReachableWhenDisabled = $state(false);
    let hasLinkComponent = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {orientation} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"orientation"}
            {...TabKnobs.ORIENTATION_TEXT}
        >
            <PageSelectField
                value={orientation}
                values={TABS_ORIENTATIONS}
                ariaLabel={"Orientation"}
                onChange={(value) => {
                    orientation = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isDisabled"}
            {...TabKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.selectingArrowsMove}
/>

<PageDocsExample path={`${DOCS_ROOT}/Automatic.svelte`}>
    <AutomaticDocsExample {hasAutoActivation} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasAutoActivation"}
            {...TabKnobs.HAS_AUTO_ACTIVATION_TEXT}
        >
            <PageCheckField
                value={hasAutoActivation}
                ariaLabel={"Automatic activation"}
                onChange={(value) => {
                    hasAutoActivation = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.markerThatFollowsPointer}
/>

<PageDocsExample path={`${DOCS_ROOT}/HoverPill.svelte`}>
    <HoverPillDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.disabledTab}
/>

<PageDocsExample path={`${DOCS_ROOT}/DisabledTab.svelte`}>
    <DisabledTabDocsExample {isReachableWhenDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isReachableWhenDisabled"}
            {...TabKnobs.IS_REACHABLE_WHEN_DISABLED_TEXT}
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

<PageDocsSection
    {...DOCS_SECTIONS.links}
/>

<PageDocsExample path={`${DOCS_ROOT}/Links.svelte`}>
    <LinksDocsExample {hasLinkComponent} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasLinkComponent"}
            {...TabKnobs.HAS_LINK_COMPONENT_TEXT}
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
    {...DOCS_SECTIONS.clearableSelection}
/>

<PageDocsExample path={`${DOCS_ROOT}/Clearable.svelte`}>
    <ClearableDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.placedLayout}
/>

<PageDocsExample path={`${DOCS_ROOT}/Honeycomb.svelte`}>
    <HoneycombDocsExample />
</PageDocsExample>
