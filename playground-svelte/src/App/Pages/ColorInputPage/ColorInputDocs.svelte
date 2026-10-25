<script lang="ts">
    import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ColorInputPage/ColorInputPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import LabeledDocsExample from "./Docs/Labeled.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import SnappingDocsExample from "./Docs/Snapping.svelte";
    import SwatchDocsExample from "./Docs/Swatch.svelte";
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
            hint={"Marks the field invalid, for screen readers as well as for the painter."}
            controls={"Sets ColorInputProps.hasError"}
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
            hint={"Turns the field off: pressing it opens no picker, and the Tab key skips it."}
            controls={"Sets ColorInputProps.isDisabled"}
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
    content={"Inside a box whose text runs right to left, the field turns round with it: the swatch sits on the right, while the painter keeps the value itself left to right, so rgb(51 102 255) is not scrambled. The picker opens under the field lined up with its right edge and runs right to left too, but neither the square nor the hue strip inside it mirrors, since they are pictures of color rather than text: saturation still grows to the right, the hue strip still starts from red at the left, and the right arrow moves either one to the right."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"A swatch alone"}
    content={"The field draws nothing of its own: [prop]renderContent[/prop] is handed the color and paints it however it likes, here as a swatch with no text beside it. The readout shows the value the swatch stands for. The field's name says what the color is for, so the color itself reaches a screen reader as the field's description, from [prop]computeValueText[/prop]: here its red, green and blue spelled out. Left out, the value is read as written, and no painter has to draw any text for it ([wcag id=\"4.1.2\"]WCAG 4.1.2[/wcag])."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Swatch.svelte`}>
    <SwatchDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Correcting a pick"}
    content={"Every change also runs [prop]onInput[/prop], and whatever it writes to the value is what the field holds. Here every color is pulled to the nearest of four in a palette, so dragging across the square jumps from one to the next."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Snapping.svelte`}>
    <SnappingDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Tooltip"}
    content={"Give a field [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled field shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and pressing it still opens nothing."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Tooltip.svelte`}>
    <TooltipDocsExample isDisabled={isTooltipDisabled} {isReachableWhenDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"tooltipIsReachableWhenDisabled"}
            label={"Reachable when disabled"}
            hint={"Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on."}
            controls={"Sets ColorInputProps.isReachableWhenDisabled"}
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
            hint={"Turns the field off: pressing it opens no picker, and the Tab key skips it."}
            controls={"Sets ColorInputProps.isDisabled"}
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
    content={"Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text opens the picker."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Labeled.svelte`}>
    <LabeledDocsExample />
</PageDocsExample>
