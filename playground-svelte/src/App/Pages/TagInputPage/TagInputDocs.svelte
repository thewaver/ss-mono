<script lang="ts">
    import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/TagInputPage/TagInputPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import CrowdedDocsExample from "./Docs/Crowded.svelte";
    import EmptyDocsExample from "./Docs/Empty.svelte";
    import LabeledDocsExample from "./Docs/Labeled.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import TooltipDocsExample from "./Docs/Tooltip.svelte";
    import UniqueDocsExample from "./Docs/Unique.svelte";

    let hasError = $state(false);
    let isDisabled = $state(false);
    let isReachableWhenDisabled = $state(false);
    let isTooltipDisabled = $state(false);
</script>

<PageDocsSection
    title={"Naming each tag"}
    content={"A tag is a button, and pressing it removes it. Its visible word alone does not say that, so a screen reader would hear only \"solid, button\" and not what the button is for ([wcag id=\"2.4.6\"]WCAG 2.4.6[/wcag]). Every example here names its tags through [prop]computeTagAriaLabel[/prop], which is handed the tag and answers in the page's language: here \"solid, remove\". The tag's own word comes first, so someone speaking to their computer can still say what they see ([wcag id=\"2.5.3\"]WCAG 2.5.3[/wcag])."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {hasError} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasError"}
            label={"Error"}
            hint={"Marks the field invalid, for screen readers as well as for the painter."}
            controls={"Sets TagInputProps.hasError"}
        >
            <PageCheckField
                value={hasError}
                ariaLabel={"Error"}
                onChange={(value) => {
                    hasError = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isDisabled"}
            label={"Disabled"}
            hint={"Turns the field off: no tag can be added, none can be removed, and the Tab key skips it."}
            controls={"Sets TagInputProps.isDisabled"}
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
    title={"Placeholder"}
    content={"While the field holds no tags and nothing is typed, it draws [prop]renderPlaceholder[/prop]; the first letter typed hides it, and so does a tag."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Empty.svelte`}>
    <EmptyDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Refusing a word"}
    content={"Every word passes through [prop]computeTag[/prop] before it becomes a tag, which can trim it, change it, or refuse it by answering with nothing. Here words are trimmed and lower-cased, and one already in the list is refused and stays in the field to be edited."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Unique.svelte`}>
    <UniqueDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Many tags in a narrow box"}
    content={"Tags that do not fit on one line wrap onto the next, and the box grows to hold them: nothing is cut off and nothing scrolls. The field always takes a row of its own beneath the tags."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Crowded.svelte`}>
    <CrowdedDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Right to left"}
    content={"Inside a box whose text runs right to left, the tags run from the right, and the arrows are mirrored: from the empty field the right arrow steps back into the tags, and the left arrow walks back toward the field."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Tooltip"}
    content={"Give a field [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled field shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and typing still changes nothing."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Tooltip.svelte`}>
    <TooltipDocsExample isDisabled={isTooltipDisabled} {isReachableWhenDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"tooltipIsReachableWhenDisabled"}
            label={"Reachable when disabled"}
            hint={"Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on."}
            controls={"Sets TagInputProps.isReachableWhenDisabled"}
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
            label={"Disabled"}
            hint={"Turns the field off: no tag can be added, none can be removed, and the Tab key skips it."}
            controls={"Sets TagInputProps.isDisabled"}
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

<PageDocsSection
    title={"Named by a Label"}
    content={"Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text focuses the field."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Labeled.svelte`}>
    <LabeledDocsExample />
</PageDocsExample>
