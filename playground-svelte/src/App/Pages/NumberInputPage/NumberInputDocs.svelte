<script lang="ts">
    import { NumberInputKnobs } from "@thewaver/ss-playground/App/Knobs/NumberInputs.const";
    import {
        DOCS_ROOT,
        GERMAN_LOCALE,
        NUMBER_LOCALES,
        QUANTITY_MAX,
        QUANTITY_MIN,
        QUANTITY_STEP,
    } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import LabeledDocsExample from "./Docs/Labeled.svelte";
    import LocaleDocsExample from "./Docs/Locale.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import SteppingDocsExample from "./Docs/Stepping.svelte";
    import TooltipDocsExample from "./Docs/Tooltip.svelte";
    import UnitDocsExample from "./Docs/Unit.svelte";

    let isReadOnly = $state(false);
    let hasError = $state(false);
    let isDisabled = $state(false);
    let min = $state(QUANTITY_MIN);
    let max = $state(QUANTITY_MAX);
    let step = $state(QUANTITY_STEP);
    let locale = $state(GERMAN_LOCALE);
    let isReachableWhenDisabled = $state(false);
    let isTooltipDisabled = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {isReadOnly} {hasError} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"isReadOnly"}
            label={"Read-only"}
            hint={"Its number can be selected and copied, but neither typing, pasting nor the stepper changes it."}
            controls={"Sets NumberInputProps.isReadOnly"}
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
            controls={"Sets NumberInputProps.hasError"}
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
            hint={"Turns the field off: nothing can write to it, the stepper is off too, and the Tab key skips it."}
            controls={"Sets NumberInputProps.isDisabled"}
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
    content={"Inside a box whose text runs right to left, the number starts from the right and the trailing slot, here the unit and the stepper, sits on the left, taking the narrow side of the [prop]padding[/prop] with it. The up and down arrow keys keep their meaning."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Stepping and limits"}
    content={"Its value is a number, or undefined while the field is empty. The up and down arrow keys and the stepper buttons move it by [prop]step[/prop], repeating while held, and a fractional step lands on clean values rather than drifting. A [prop]min[/prop] and a [prop]max[/prop] keep it in range: a typed value outside them is corrected once the field is left, never while it is being typed."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Stepping.svelte`}>
    <SteppingDocsExample {min} {max} {step} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"min"}
            label={"Min"}
            hint={"The lowest value the field accepts."}
            controls={"Sets NumberInputProps.min"}
        >
            <PageNumberField
                value={min}
                min={NumberInputKnobs.MIN_LIMIT}
                max={NumberInputKnobs.MAX_LIMIT}
                step={NumberInputKnobs.LIMIT_STEP}
                ariaLabel={"Min"}
                onInput={(value) => {
                    min = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"max"}
            label={"Max"}
            hint={"The highest value the field accepts."}
            controls={"Sets NumberInputProps.max"}
        >
            <PageNumberField
                value={max}
                min={NumberInputKnobs.MIN_LIMIT}
                max={NumberInputKnobs.MAX_LIMIT}
                step={NumberInputKnobs.LIMIT_STEP}
                ariaLabel={"Max"}
                onInput={(value) => {
                    max = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"step"}
            label={"Step"}
            hint={"How far one press of an arrow key or a stepper button moves the value."}
            controls={"Sets NumberInputProps.step"}
        >
            <PageNumberField
                value={step}
                min={NumberInputKnobs.MIN_STEP}
                max={NumberInputKnobs.MAX_STEP}
                step={NumberInputKnobs.STEP_STEP}
                ariaLabel={"Step"}
                onInput={(value) => {
                    step = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    title={"Numbers written the local way"}
    content={"Give it a [prop]locale[/prop] and it reads and writes numbers the way that locale does: in German, a comma before the decimals and dots between the thousands. Left out, it follows the reader's own."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Locale.svelte`}>
    <LocaleDocsExample {locale} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"locale"}
            label={"Locale"}
            hint={"The language and region whose way of writing numbers the field uses."}
            controls={"Sets NumberInputProps.locale"}
        >
            <PageSelectField
                value={locale}
                values={NUMBER_LOCALES}
                ariaLabel={"Locale"}
                onChange={(value) => {
                    locale = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    title={"A unit beside the stepper"}
    content={"The trailing slot is handed the stepper and can draw more next to it, such as the unit the number is in."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Unit.svelte`}>
    <UnitDocsExample />
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
            controls={"Sets NumberInputProps.isReachableWhenDisabled"}
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
            hint={"Turns the field off: nothing can write to it, the stepper is off too, and the Tab key skips it."}
            controls={"Sets NumberInputProps.isDisabled"}
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
