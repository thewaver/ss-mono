<script setup lang="ts">
import { shallowRef } from "vue";

import { FileInputKnobs } from "@thewaver/ss-playground/App/Knobs/FileInputs.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/FileInputPage/FileInputPage.const";

import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.vue";
import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import DropZoneDocsExample from "./Docs/DropZone.vue";
import ImagesDocsExample from "./Docs/Images.vue";
import LabeledDocsExample from "./Docs/Labeled.vue";
import MultipleDocsExample from "./Docs/Multiple.vue";
import RefusingDocsExample from "./Docs/Refusing.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";

const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const dropZoneHasError = shallowRef(false);
const dropZoneIsDisabled = shallowRef(false);
const isReachableWhenDisabled = shallowRef(false);
const isTooltipDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :has-error="hasError" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="hasError" v-bind="FileInputKnobs.HAS_ERROR_TEXT">
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="FileInputKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.severalFiles" />

    <PageDocsExample :path="`${DOCS_ROOT}/Multiple.vue`">
        <MultipleDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.someFileKindsOnly" />

    <PageDocsExample :path="`${DOCS_ROOT}/Images.vue`">
        <ImagesDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.refusingPick" />

    <PageDocsExample :path="`${DOCS_ROOT}/Refusing.vue`">
        <RefusingDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.droppingFilesWithinLimits" />

    <PageDocsAlert severity="alert">
        Keep the control pressable, and say so in what it shows. A drop is a drag, which not everyone can make, so
        pressing the control to open the dialog must reach the same files (<a :href="WCAG_URLS['2.5.7']">WCAG 2.5.7</a
        >). Never cover the control with a drop area, or paint it as a place to drop alone.
    </PageDocsAlert>

    <PageDocsExample :path="`${DOCS_ROOT}/DropZone.vue`">
        <DropZoneDocsExample :has-error="dropZoneHasError" :is-disabled="dropZoneIsDisabled" />

        <template #renderKnobs>
            <PageProp item-key="dropZoneHasError" v-bind="FileInputKnobs.HAS_ERROR_TEXT">
                <PageCheckField
                    :value="dropZoneHasError"
                    ariaLabel="Error"
                    @change="(value: boolean) => (dropZoneHasError = value)"
                />
            </PageProp>

            <PageProp item-key="dropZoneIsDisabled" v-bind="FileInputKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="dropZoneIsDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (dropZoneIsDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.tooltip" />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                v-bind="FileInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>

            <PageProp item-key="tooltipIsDisabled" v-bind="FileInputKnobs.IS_DISABLED_TEXT">
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
