<script lang="ts">
    import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, MENU_DEFAULTS } from "@thewaver/ss-components-svelte";
    import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-svelte";
    import { DOCS_SECTIONS, DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.const";

    import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../../PageComponents/Field/PageCheckField.svelte";
    import PageSelectField from "../../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import CascaderDocsExample from "./Docs/Cascader.svelte";
    import ContextDocsExample from "./Docs/Context.svelte";
    import ContextRightToLeftDocsExample from "./Docs/ContextRightToLeft.svelte";
    import DisabledItemsDocsExample from "./Docs/DisabledItems.svelte";
    import DrivenDocsExample from "./Docs/Driven.svelte";
    import GlideDocsExample from "./Docs/Glide.svelte";
    import LongListDocsExample from "./Docs/LongList.svelte";
    import PlacementDocsExample from "./Docs/Placement.svelte";
    import RepeatingDocsExample from "./Docs/Repeating.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import SectionsDocsExample from "./Docs/Sections.svelte";
    import StatefulDocsExample from "./Docs/Stateful.svelte";
    import SubmenusDocsExample from "./Docs/Submenus.svelte";
    import TooltipDocsExample from "./Docs/Tooltip.svelte";
    import { MenuKnobs } from "@thewaver/ss-playground/App/Knobs/Menus.const";

    let isDisabled = $state(false);
    let placementX = $state<AnchorHPlacement>(MENU_DEFAULTS.placement.ltr.x);
    let placementY = $state<AnchorVPlacement>("top_out");
    let submenuPlacementX = $state<AnchorHPlacement>(MENU_DEFAULTS.submenuPlacement.ltr.x);
    let isReachable = $state(false);
    let isGliding = $state(true);
    let isReachableWhenDisabled = $state(false);
    let isTooltipDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isDisabled"}
            {...MenuKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.submenus}
/>

<PageDocsExample path={`${DOCS_ROOT}/Submenus.svelte`}>
    <SubmenusDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.pickingPath}
/>

<PageDocsExample path={`${DOCS_ROOT}/Cascader.svelte`}>
    <CascaderDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.openedRightClick}
/>

<PageDocsExample path={`${DOCS_ROOT}/Context.svelte`}>
    <ContextDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsExample path={`${DOCS_ROOT}/ContextRightToLeft.svelte`}>
    <ContextRightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.placement}
/>

<PageDocsExample path={`${DOCS_ROOT}/Placement.svelte`}>
    <PlacementDocsExample
        placement={{ x: placementX, y: placementY }}
        submenuPlacement={{ x: submenuPlacementX, y: MENU_DEFAULTS.submenuPlacement.ltr.y }}
    />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"placementX"}
            {...MenuKnobs.PLACEMENT_X_TEXT}
        >
            <PageSelectField
                value={placementX}
                values={ANCHOR_H_PLACEMENTS}
                width={FIELD_WIDTH}
                ariaLabel={"Placement across"}
                onChange={(value) => {
                    placementX = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"placementY"}
            {...MenuKnobs.PLACEMENT_Y_TEXT}
        >
            <PageSelectField
                value={placementY}
                values={ANCHOR_V_PLACEMENTS}
                width={FIELD_WIDTH}
                ariaLabel={"Placement down"}
                onChange={(value) => {
                    placementY = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"submenuPlacementX"}
            {...MenuKnobs.SUBMENU_PLACEMENT_X_TEXT}
        >
            <PageSelectField
                value={submenuPlacementX}
                values={ANCHOR_H_PLACEMENTS}
                width={FIELD_WIDTH}
                ariaLabel={"Submenu placement across"}
                onChange={(value) => {
                    submenuPlacementX = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.rowsThatHoldState}
/>

<PageDocsExample path={`${DOCS_ROOT}/Stateful.svelte`}>
    <StatefulDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.sections}
/>

<PageDocsExample path={`${DOCS_ROOT}/Sections.svelte`}>
    <SectionsDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.disabledItems}
/>

<PageDocsExample path={`${DOCS_ROOT}/DisabledItems.svelte`}>
    <DisabledItemsDocsExample {isReachable} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isReachable"}
            {...MenuKnobs.IS_REACHABLE_TEXT}
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
    {...DOCS_SECTIONS.commandsWorthRepeating}
/>

<PageDocsExample path={`${DOCS_ROOT}/Repeating.svelte`}>
    <RepeatingDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.longList}
/>

<PageDocsExample path={`${DOCS_ROOT}/LongList.svelte`}>
    <LongListDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.highlightThatGlides}
/>

<PageDocsExample path={`${DOCS_ROOT}/Glide.svelte`}>
    <GlideDocsExample {isGliding} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isGliding"}
            {...MenuKnobs.IS_GLIDING_TEXT}
        >
            <PageCheckField
                value={isGliding}
                ariaLabel={"Gliding highlight"}
                onChange={(value) => {
                    isGliding = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.openingClosingOutside}
/>

<PageDocsExample path={`${DOCS_ROOT}/Driven.svelte`}>
    <DrivenDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.tooltip}
/>

<PageDocsExample path={`${DOCS_ROOT}/Tooltip.svelte`}>
    <TooltipDocsExample isDisabled={isTooltipDisabled} {isReachableWhenDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"tooltipIsReachableWhenDisabled"}
            {...MenuKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
        >
            <PageCheckField
                value={isReachableWhenDisabled}
                ariaLabel={"Reachable when disabled"}
                onChange={(value) => {
                    isReachableWhenDisabled = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"tooltipIsDisabled"}
            {...MenuKnobs.IS_DISABLED_TEXT}
        >
            <PageCheckField
                value={isTooltipDisabled}
                ariaLabel={"Disabled"}
                onChange={(value) => {
                    isTooltipDisabled = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>
