<script lang="ts">
    import { SIDEBAR_DEFAULTS, SIDEBAR_EDGES, SIDEBAR_LAYOUTS } from "@thewaver/ss-components-svelte";
    import type { SidebarEdge, SidebarLayout } from "@thewaver/ss-components-svelte";
    import { SidebarKnobs } from "@thewaver/ss-playground/App/Knobs/Sidebars.const";
    import { DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/SidebarPage/SidebarPage.const";

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
            label={"Edge"}
            hint={"Which side of its neighbor the sidebar is docked to, and so which way it grows. Docked to the top or bottom, it spans the width and grows in height."}
            controls={"Sets SidebarProps.edge"}
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
            label={"Transition duration (ms)"}
            hint={"How long the sidebar takes to grow and shrink. At 0 it changes size at once."}
            controls={"Sets SidebarProps.transitionDurationMs"}
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
    title={"Right to left"}
    content={"Inside a box whose text runs right to left, the sidebar stays on the side [prop]edge[/prop] names, the left here, since its edges are the screen's sides; its contents and the content beside it run from the right."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Over its neighbor"}
    content={"Set [prop]layout[/prop] to overlay and the sidebar grows over the content beside it instead of pushing it aside. In the layout it only ever takes its collapsed size, so the neighbor never moves; the panel grows out from the docked edge, raised above what it covers."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Overlay.svelte`}>
    <OverlayDocsExample {layout} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"layout"}
            label={"Layout"}
            hint={"Whether growing pushes the content beside the sidebar aside or grows over it."}
            controls={"Sets SidebarProps.layout"}
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
    title={"Expanding on hover"}
    content={"With [prop]isExpandedOnHover[/prop] on, resting the pointer on the sidebar for [prop]hoverShowDelayMs[/prop] expands it, and moving away, pressing Escape or pressing elsewhere collapses it again ([wcag id=\"1.4.13\"]WCAG 1.4.13[/wcag]). It never writes [prop]expanded[/prop], so the button still reads collapsed while the sidebar is only being looked at, and a sidebar expanded by the button stays expanded when the pointer leaves."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Hover.svelte`}>
    <HoverDocsExample {isExpandedOnHover} {hoverShowDelayMs} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isExpandedOnHover"}
            label={"Expands on hover"}
            hint={"Whether resting the pointer on the sidebar expands it, without changing its expanded state."}
            controls={"Sets SidebarProps.isExpandedOnHover"}
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
            label={"Hover delay (ms)"}
            hint={"How long the pointer has to rest on the sidebar before it expands."}
            controls={"Sets SidebarProps.hoverShowDelayMs"}
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
