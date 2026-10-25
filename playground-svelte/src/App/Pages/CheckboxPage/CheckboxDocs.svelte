<script lang="ts">
    import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/CheckboxPage/CheckboxPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import DecoratedDocsExample from "./Docs/Decorated.svelte";
    import MixedDocsExample from "./Docs/Mixed.svelte";
    import RefusingDocsExample from "./Docs/Refusing.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import TooltipDocsExample from "./Docs/Tooltip.svelte";

    let hasError = $state(false);
    let isDisabled = $state(false);
    let isReachableWhenDisabled = $state(false);
    let isTooltipDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {hasError} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasError"}
            label={"Error"}
            hint={"Marks the checkbox invalid, for screen readers as well as for the painter."}
            controls={"Sets CheckboxProps.hasError"}
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
            hint={"Turns the checkbox off: neither a click nor Space changes it, and the Tab key skips it."}
            controls={"Sets CheckboxProps.isDisabled"}
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
    title={"Right to left"}
    content={"Inside a box whose text runs right to left, the box sits to the right of its words."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Mixed"}
    content={"A checkbox can be neither on nor off. Set [prop]isMixed[/prop] and it reads as mixed, to a screen reader as well as on screen, which is what a box summarizing others shows while they disagree. Pressing it sets a value, so here it turns both of the boxes it controls on or off."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Mixed.svelte`}>
    <MixedDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Refusing a change"}
    content={"The checkbox reports a press through [prop]onChange[/prop] and shows whatever its value then holds, so a change can be refused by writing the old value back. Here at least one way to be reached must stay on: whichever box is the last one on refuses to go off."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Refusing.svelte`}>
    <RefusingDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Decoration"}
    content={"Anything drawn over the box goes through [prop]renderDecoration[/prop], which is handed the checkbox's state like the painter is: here a corner highlight shows while it is pressed."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Decorated.svelte`}>
    <DecoratedDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Tooltip"}
    content={"Give a checkbox [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the checkbox's description. A disabled checkbox shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and pressing it still changes nothing."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Tooltip.svelte`}>
    <TooltipDocsExample isDisabled={isTooltipDisabled} {isReachableWhenDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"tooltipIsReachableWhenDisabled"}
            label={"Reachable when disabled"}
            hint={"Keeps a disabled checkbox's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled checkbox shows no tooltip at all. It only matters while Disabled is on."}
            controls={"Sets CheckboxProps.isReachableWhenDisabled"}
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
            hint={"Turns the checkbox off: neither a click nor Space changes it, and the Tab key skips it."}
            controls={"Sets CheckboxProps.isDisabled"}
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
