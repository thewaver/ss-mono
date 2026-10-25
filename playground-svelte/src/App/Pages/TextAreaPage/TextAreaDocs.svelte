<script lang="ts">
    import { TextAreaKnobs } from "@thewaver/ss-playground/App/Knobs/TextAreas.const";
    import { DOCS_ROOT, MAX_ROWS } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import GrowingDocsExample from "./Docs/Growing.svelte";
    import LabeledDocsExample from "./Docs/Labeled.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import TooltipDocsExample from "./Docs/Tooltip.svelte";

    let isReadOnly = $state(false);
    let hasError = $state(false);
    let isDisabled = $state(false);
    let maxRows = $state(MAX_ROWS);
    let isReachableWhenDisabled = $state(false);
    let isTooltipDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {isReadOnly} {hasError} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isReadOnly"}
            label={"Read-only"}
            hint={"Its text can be selected and copied, but neither typing nor pasting changes it."}
            controls={"Sets TextAreaProps.isReadOnly"}
        >
            <PageCheckField
                value={isReadOnly}
                ariaLabel={"Read-only"}
                onChange={(value) => {
                    isReadOnly = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"hasError"}
            label={"Error"}
            hint={"Marks the field invalid, for screen readers as well as for the painter."}
            controls={"Sets TextAreaProps.hasError"}
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
            hint={"Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."}
            controls={"Sets TextAreaProps.isDisabled"}
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
    content={"Inside a box whose text runs right to left, every line starts from the right of the box, and so does the placeholder. The sides of [prop]padding[/prop] are where the text starts and ends rather than the screen's left and right."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Growing with what is typed"}
    content={"With [prop]isAutoSizing[/prop] on, the box follows its own content: it starts [prop]minRows[/prop] tall and grows a row at a time as lines are added, so nothing has to guess a height. At [prop]maxRows[/prop] it stops growing and scrolls instead."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Growing.svelte`}>
    <GrowingDocsExample {maxRows} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"maxRows"}
            label={"Max rows"}
            hint={"The most rows the box grows to before it starts scrolling."}
            controls={"Sets TextAreaProps.maxRows"}
        >
            <PageNumberField
                value={maxRows}
                min={TextAreaKnobs.MIN_MAX_ROWS}
                max={TextAreaKnobs.MAX_MAX_ROWS}
                step={TextAreaKnobs.MAX_ROWS_STEP}
                ariaLabel={"Max rows"}
                onInput={(value) => {
                    maxRows = value;
                }}
            />
        </PageProp>
    {/snippet}
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
            controls={"Sets TextAreaProps.isReachableWhenDisabled"}
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
            hint={"Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."}
            controls={"Sets TextAreaProps.isDisabled"}
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
