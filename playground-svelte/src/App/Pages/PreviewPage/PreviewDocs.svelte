<script lang="ts">
    import { PreviewKnobs } from "@thewaver/ss-playground/App/Knobs/Previews.const";
    import { COLLAPSED_HEIGHT, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";

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
            label={"Collapsed height (px)"}
            hint={"How much of the content shows while the preview is closed."}
            controls={"Sets PreviewProps.collapsedHeight"}
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
    title={"Right to left"}
    content={"Inside a box whose text runs right to left, the content and the button that opens it sit against the right edge."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"When everything fits"}
    content={"Content no taller than [prop]collapsedHeight[/prop] is shown whole, with no button and no fade, since there is nothing behind them."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Short.svelte`}>
    <ShortDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Opening and closing from outside"}
    content={"The preview keeps track of whether it is open by itself. To open or close it from elsewhere on the page, hold the boolean and pass it in as [prop]expanded[/prop]: both sides write it, so pressing Read more updates yours and writing yours opens or closes the preview."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Controlled.svelte`}>
    <ControlledDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Inside a box that scrolls"}
    content={"Closing a long preview takes its height out from under the reader, and everything below it jumps up, the button with it. Set [prop]isScrolledIntoViewOnCollapse[/prop] and closing scrolls the preview back into view, so the reader is left where they started."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Scrolled.svelte`}>
    <ScrolledDocsExample {isScrolledIntoViewOnCollapse} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isScrolledIntoViewOnCollapse"}
            label={"Scroll into view on collapse"}
            hint={"Whether closing the preview scrolls it back into view."}
            controls={"Sets PreviewProps.isScrolledIntoViewOnCollapse"}
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
