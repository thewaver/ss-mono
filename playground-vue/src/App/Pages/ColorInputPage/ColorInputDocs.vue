<script setup lang="ts">
import { shallowRef } from "vue";

import { ColorInputKnobs } from "@thewaver/ss-playground/App/Knobs/ColorInputs.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/ColorInputPage/ColorInputPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import LabeledDocsExample from "./Docs/Labeled.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import SnappingDocsExample from "./Docs/Snapping.vue";
import SwatchDocsExample from "./Docs/Swatch.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";

const SWATCH_CONTENT =
    "The field draws nothing of its own: [prop]renderContent[/prop] is handed the color and paints it however it likes, here as a swatch with no text beside it. The readout shows the value the swatch stands for. The field's name says what the color is for, so the color itself reaches a screen reader as the field's description, from [prop]computeValueText[/prop]: here its red, green and blue spelled out. Left out, the value is read as written, and no painter has to draw any text for it ([wcag id=\"4.1.2\"]WCAG 4.1.2[/wcag]).";

const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const isReachableWhenDisabled = shallowRef(false);
const isTooltipDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :has-error="hasError" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="hasError" v-bind="ColorInputKnobs.HAS_ERROR_TEXT">
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="ColorInputKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection title="A swatch alone" :content="SWATCH_CONTENT" />

    <PageDocsExample :path="`${DOCS_ROOT}/Swatch.vue`">
        <SwatchDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.correctingPick" />

    <PageDocsExample :path="`${DOCS_ROOT}/Snapping.vue`">
        <SnappingDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.tooltip" />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                v-bind="ColorInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>

            <PageProp item-key="tooltipIsDisabled" v-bind="ColorInputKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isTooltipDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isTooltipDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.namedLabel" />

    <PageDocsExample :path="`${DOCS_ROOT}/Labeled.vue`">
        <LabeledDocsExample />
    </PageDocsExample>
</template>
