<script lang="ts">
    import { SIDEBAR_DEFAULTS, SIDEBAR_EDGES, SIDEBAR_LAYOUTS } from "@thewaver/ss-components-svelte";
    import type { SidebarEdge, SidebarLayout } from "@thewaver/ss-components-svelte";
    import { SidebarKnobs } from "@thewaver/ss-playground/App/Knobs/Sidebars.const";
    import { DOCS_SECTIONS, DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/SidebarPage/SidebarPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import HoverDocsExample from "./Docs/Hover.svelte";
    import OverlayDocsExample from "./Docs/Overlay.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";

    let edge = $state<SidebarEdge>(SIDEBAR_DEFAULTS.edge);
    let transitionDurationMs = $state(SIDEBAR_DEFAULTS.transitionDurationMs);
    let layout = $state<SidebarLayout>("overlay");
    let isExpandedOnHover = $state(true);
    let hoverShowDelayMs = $state(SIDEBAR_DEFAULTS.hoverShowDelayMs);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {edge} {transitionDurationMs} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"edge"}
            {...SidebarKnobs.EDGE_TEXT}
        >
            <PageSelectField
                value={edge}
                values={SIDEBAR_EDGES}
                ariaLabel={"Edge"}
                onChange={(value) => {
                    edge = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"transitionDurationMs"}
            {...SidebarKnobs.TRANSITION_DURATION_MS_TEXT}
        >
            <PageNumberField
                value={transitionDurationMs}
                min={SidebarKnobs.MIN_TRANSITION_MS}
                max={SidebarKnobs.MAX_TRANSITION_MS}
                step={SidebarKnobs.TRANSITION_STEP_MS}
                width={FIELD_WIDTH}
                ariaLabel={"Transition duration in milliseconds"}
                onInput={(value) => {
                    transitionDurationMs = value;
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
    {...DOCS_SECTIONS.overNeighbor}
/>

<PageDocsExample path={`${DOCS_ROOT}/Overlay.svelte`}>
    <OverlayDocsExample {layout} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"layout"}
            {...SidebarKnobs.LAYOUT_TEXT}
        >
            <PageSelectField
                value={layout}
                values={SIDEBAR_LAYOUTS}
                ariaLabel={"Layout"}
                onChange={(value) => {
                    layout = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.expandingHover}
/>

<PageDocsExample path={`${DOCS_ROOT}/Hover.svelte`}>
    <HoverDocsExample {isExpandedOnHover} {hoverShowDelayMs} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isExpandedOnHover"}
            {...SidebarKnobs.IS_EXPANDED_ON_HOVER_TEXT}
        >
            <PageCheckField
                value={isExpandedOnHover}
                ariaLabel={"Expands on hover"}
                onChange={(value) => {
                    isExpandedOnHover = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"hoverShowDelayMs"}
            {...SidebarKnobs.HOVER_SHOW_DELAY_MS_TEXT}
        >
            <PageNumberField
                value={hoverShowDelayMs}
                min={SidebarKnobs.MIN_DELAY_MS}
                max={SidebarKnobs.MAX_DELAY_MS}
                step={SidebarKnobs.DELAY_STEP_MS}
                width={FIELD_WIDTH}
                ariaLabel={"Hover delay in milliseconds"}
                onInput={(value) => {
                    hoverShowDelayMs = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>
