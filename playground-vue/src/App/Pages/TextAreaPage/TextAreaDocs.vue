<script setup lang="ts">
import { shallowRef } from "vue";

import { TextAreaKnobs } from "@thewaver/ss-playground/App/Knobs/TextAreas.const";
import { DOCS_ROOT, MAX_ROWS } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import GrowingDocsExample from "./Docs/Growing.vue";
import LabeledDocsExample from "./Docs/Labeled.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";

const isReadOnly = shallowRef(false);
const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const maxRows = shallowRef(MAX_ROWS);
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
                controls="Sets TextAreaProps.isReadOnly"
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
                controls="Sets TextAreaProps.hasError"
            >
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."
                controls="Sets TextAreaProps.isDisabled"
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
        content="Inside a box whose text runs right to left, every line starts from the right of the box, and so does the placeholder. The sides of [prop]padding[/prop] are where the text starts and ends rather than the screen's left and right."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Growing with what is typed"
        content="With [prop]isAutoSizing[/prop] on, the box follows its own content: it starts [prop]minRows[/prop] tall and grows a row at a time as lines are added, so nothing has to guess a height. At [prop]maxRows[/prop] it stops growing and scrolls instead."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Growing.vue`">
        <GrowingDocsExample :max-rows="maxRows" />

        <template #renderKnobs>
            <PageProp
                item-key="maxRows"
                label="Max rows"
                hint="The most rows the box grows to before it starts scrolling."
                controls="Sets TextAreaProps.maxRows"
            >
                <PageNumberField
                    :value="maxRows"
                    :min="TextAreaKnobs.MIN_MAX_ROWS"
                    :max="TextAreaKnobs.MAX_MAX_ROWS"
                    :step="TextAreaKnobs.MAX_ROWS_STEP"
                    ariaLabel="Max rows"
                    @input="(value: number) => (maxRows = value)"
                />
            </PageProp>
        </template>
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
                controls="Sets TextAreaProps.isReachableWhenDisabled"
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
                controls="Sets TextAreaProps.isDisabled"
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
