<script setup lang="ts">
import { shallowRef } from "vue";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import AdornmentsDocsExample from "./Docs/Adornments.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import EditableDocsExample from "./Docs/Editable.vue";
import LabeledDocsExample from "./Docs/Labeled.vue";
import NumberDocsExample from "./Docs/Number.vue";
import PasswordDocsExample from "./Docs/Password.vue";
import RefusingDocsExample from "./Docs/Refusing.vue";
import RewritingDocsExample from "./Docs/Rewriting.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import SuggestionsDocsExample from "./Docs/Suggestions.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";

const isReadOnly = shallowRef(false);
const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const isReachableWhenDisabled = shallowRef(false);
const isTooltipDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :is-read-only="isReadOnly" :has-error="hasError" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="isReadOnly"
                label="Read-only"
                hint="Its text can be selected and copied, but neither typing nor pasting changes it."
                controls="Sets TextInputProps.isReadOnly"
            >
                <PageCheckField
                    :value="isReadOnly"
                    ariaLabel="Read-only"
                    @change="(value: boolean) => (isReadOnly = value)"
                />
            </PageProp>

            <PageProp
                item-key="hasError"
                label="Error"
                hint="Marks the field invalid, for screen readers as well as for the painter."
                controls="Sets TextInputProps.hasError"
            >
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."
                controls="Sets TextInputProps.isDisabled"
            >
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, the field turns round with it: what is typed and the placeholder start from the right, the leading content sits on the right and the trailing content on the left, and the sides of [prop]padding[/prop] are where the text starts and ends rather than the screen's left and right."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Rewriting what is typed"
        content="Every change also runs [prop]onInput[/prop], and whatever it writes to the value is what the field shows. Here every letter is upper-cased on the way in, and the caret stays where it was, even when typing in the middle."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Rewriting.vue`">
        <RewritingDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Refusing what is typed"
        content="Writing less than was typed from [prop]onInput[/prop] refuses the rest. This PIN keeps digits only, no more than six of them, and reports an error while it holds fewer than six."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Refusing.vue`">
        <RefusingDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Leading and trailing content"
        content="Content can sit inside the field, before and after the text, through [prop]renderLeading[/prop] and [prop]renderTrailing[/prop]: a unit, an icon, or a control of its own, such as this Clear button."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Adornments.vue`">
        <AdornmentsDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Passwords"
        content="A [prop]type[/prop] of password hides the text, and switching it to text shows it again, here from a trailing button. Give it an [prop]autoComplete[/prop] so password managers know what to fill."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Password.vue`">
        <PasswordDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Numbers"
        content="A [prop]type[/prop] of number takes [prop]min[/prop], [prop]max[/prop] and [prop]step[/prop], and the up and down arrows step the value. It draws no buttons to step with; NumberInput is the field that does."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Number.vue`">
        <NumberDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Suggestions"
        content="Give it [prop]suggestions[/prop] and it becomes a combobox: typing opens a list under it, with nothing highlighted, so Enter keeps exactly what was typed. The arrows walk the list and Enter then writes the highlighted suggestion; Escape closes the list and leaves the text alone. Any text is allowed, so filtering the list is yours."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Suggestions.vue`">
        <SuggestionsDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Tooltip"
        content="Give a field [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled field shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and typing still changes nothing."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                label="Reachable when disabled"
                hint="Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on."
                controls="Sets TextInputProps.isReachableWhenDisabled"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>

            <PageProp
                item-key="tooltipIsDisabled"
                label="Disabled"
                hint="Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."
                controls="Sets TextInputProps.isDisabled"
            >
                <PageCheckField
                    :value="isTooltipDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isTooltipDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Named by a Label"
        content="Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text focuses the field."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Labeled.vue`">
        <LabeledDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Editing in place"
        content="A field can stand in for a button while it is being edited. Pressing the name swaps it for a field holding the current text, already focused; Enter or leaving the field keeps the edit, Escape puts the old text back, and either way focus returns to the button."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Editable.vue`">
        <EditableDocsExample />
    </PageDocsExample>
</template>
