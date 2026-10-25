<script setup lang="ts">
import { shallowRef } from "vue";

import { NumberInputKnobs } from "@thewaver/ss-playground/App/Knobs/NumberInputs.const";
import {
    DOCS_ROOT,
    GERMAN_LOCALE,
    NUMBER_LOCALES,
    QUANTITY_MAX,
    QUANTITY_MIN,
    QUANTITY_STEP,
} from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import LabeledDocsExample from "./Docs/Labeled.vue";
import LocaleDocsExample from "./Docs/Locale.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import SteppingDocsExample from "./Docs/Stepping.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";
import UnitDocsExample from "./Docs/Unit.vue";

const isReadOnly = shallowRef(false);
const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const min = shallowRef(QUANTITY_MIN);
const max = shallowRef(QUANTITY_MAX);
const step = shallowRef(QUANTITY_STEP);
const locale = shallowRef(GERMAN_LOCALE);
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
                hint="Its number can be selected and copied, but neither typing, pasting nor the stepper changes it."
                controls="Sets NumberInputProps.isReadOnly"
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
                controls="Sets NumberInputProps.hasError"
            >
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the field off: nothing can write to it, the stepper is off too, and the Tab key skips it."
                controls="Sets NumberInputProps.isDisabled"
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
        content="Inside a box whose text runs right to left, the number starts from the right and the trailing slot, here the unit and the stepper, sits on the left, taking the narrow side of the [prop]padding[/prop] with it. The up and down arrow keys keep their meaning."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Stepping and limits"
        content="Its value is a number, or undefined while the field is empty. The up and down arrow keys and the stepper buttons move it by [prop]step[/prop], repeating while held, and a fractional step lands on clean values rather than drifting. A [prop]min[/prop] and a [prop]max[/prop] keep it in range: a typed value outside them is corrected once the field is left, never while it is being typed."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Stepping.vue`">
        <SteppingDocsExample :min="min" :max="max" :step="step" />

        <template #renderKnobs>
            <PageProp
                item-key="min"
                label="Min"
                hint="The lowest value the field accepts."
                controls="Sets NumberInputProps.min"
            >
                <PageNumberField
                    :value="min"
                    :min="NumberInputKnobs.MIN_LIMIT"
                    :max="NumberInputKnobs.MAX_LIMIT"
                    :step="NumberInputKnobs.LIMIT_STEP"
                    ariaLabel="Min"
                    @input="(value: number) => (min = value)"
                />
            </PageProp>

            <PageProp
                item-key="max"
                label="Max"
                hint="The highest value the field accepts."
                controls="Sets NumberInputProps.max"
            >
                <PageNumberField
                    :value="max"
                    :min="NumberInputKnobs.MIN_LIMIT"
                    :max="NumberInputKnobs.MAX_LIMIT"
                    :step="NumberInputKnobs.LIMIT_STEP"
                    ariaLabel="Max"
                    @input="(value: number) => (max = value)"
                />
            </PageProp>

            <PageProp
                item-key="step"
                label="Step"
                hint="How far one press of an arrow key or a stepper button moves the value."
                controls="Sets NumberInputProps.step"
            >
                <PageNumberField
                    :value="step"
                    :min="NumberInputKnobs.MIN_STEP"
                    :max="NumberInputKnobs.MAX_STEP"
                    :step="NumberInputKnobs.STEP_STEP"
                    ariaLabel="Step"
                    @input="(value: number) => (step = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Numbers written the local way"
        content="Give it a [prop]locale[/prop] and it reads and writes numbers the way that locale does: in German, a comma before the decimals and dots between the thousands. Left out, it follows the reader's own."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Locale.vue`">
        <LocaleDocsExample :locale="locale" />

        <template #renderKnobs>
            <PageProp
                item-key="locale"
                label="Locale"
                hint="The language and region whose way of writing numbers the field uses."
                controls="Sets NumberInputProps.locale"
            >
                <PageSelectField
                    :value="locale"
                    :values="NUMBER_LOCALES"
                    ariaLabel="Locale"
                    @change="(value: string) => (locale = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="A unit beside the stepper"
        content="The trailing slot is handed the stepper and can draw more next to it, such as the unit the number is in."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Unit.vue`">
        <UnitDocsExample />
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
                controls="Sets NumberInputProps.isReachableWhenDisabled"
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
                hint="Turns the field off: nothing can write to it, the stepper is off too, and the Tab key skips it."
                controls="Sets NumberInputProps.isDisabled"
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
</template>
