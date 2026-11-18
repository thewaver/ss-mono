<script lang="ts">
    import { EDGE_FADER_DEFAULTS } from "@thewaver/ss-components-svelte";
    import type { EdgeFaderEdge } from "@thewaver/ss-components-svelte";
    import { EdgeFaderKnobs } from "@thewaver/ss-playground/App/Knobs/EdgeFaders.const";
    import { DOCS_SECTIONS, DOCS_ROOT, EDGE_LABELS } from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import ScrollAwareDocsExample from "./Docs/ScrollAware.svelte";
    import SidesDocsExample from "./Docs/Sides.svelte";
    import UnscrolledDocsExample from "./Docs/Unscrolled.svelte";

    let size = $state(EDGE_FADER_DEFAULTS.size);
    let edges = $state.raw<EdgeFaderEdge[]>(EDGE_FADER_DEFAULTS.edges);
    let isScrollAware = $state(true);

    const setHasEdge = (edge: EdgeFaderEdge, hasEdge: boolean) => {
        edges = EDGE_FADER_DEFAULTS.edges.filter((candidate) =>
            candidate === edge ? hasEdge : edges.includes(candidate),
        );
    };
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {size} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"size"}
            {...EdgeFaderKnobs.SIZE_TEXT}
        >
            <PageNumberField
                value={size}
                min={EdgeFaderKnobs.MIN_SIZE}
                max={EdgeFaderKnobs.MAX_SIZE}
                step={EdgeFaderKnobs.SIZE_STEP}
                ariaLabel={"Fade size in pixels"}
                onInput={(value) => {
                    size = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.anyMixSides}
/>

<PageDocsExample path={`${DOCS_ROOT}/Sides.svelte`}>
    <SidesDocsExample {edges} />

    {#snippet renderKnobs()}
        {#each EDGE_FADER_DEFAULTS.edges as edge (edge)}
            <PageProp
                itemKey={edge}
                label={EDGE_LABELS[edge]}
                hint={`Whether the ${edge} side fades.`}
                controls={"Sets EdgeFaderProps.edges"}
            >
                <PageCheckField
                    value={edges.includes(edge)}
                    ariaLabel={EDGE_LABELS[edge]}
                    onChange={(hasEdge) => setHasEdge(edge, hasEdge)}
                />
            </PageProp>
        {/each}
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.fadingOnlyOutOfView}
/>

<PageDocsExample path={`${DOCS_ROOT}/ScrollAware.svelte`}>
    <ScrollAwareDocsExample {isScrollAware} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isScrollAware"}
            {...EdgeFaderKnobs.IS_SCROLL_AWARE_TEXT}
        >
            <PageCheckField
                value={isScrollAware}
                ariaLabel={"Scroll-aware"}
                onChange={(value) => {
                    isScrollAware = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.aroundNonScrolling}
/>

<PageDocsExample path={`${DOCS_ROOT}/Unscrolled.svelte`}>
    <UnscrolledDocsExample />
</PageDocsExample>
